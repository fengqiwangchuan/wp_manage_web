<template>
  <v-card>
    <v-card-title>
      <v-btn color="primary" @click="addBrand">新增品牌</v-btn>
      <v-spacer />
      <v-flex xs3>
        <v-text-field label="输入关键字搜索" v-model.lazy="search" append-icon="search" hide-details></v-text-field>
      </v-flex>
    </v-card-title>
    <v-data-table :headers="headers" :items="brands" :pagination.sync="pagination" :total-items="totalBrands" :loading="loading"
      class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.id }}</td>
        <td class="text-xs-center">{{ props.item.name }}</td>
        <td class="text-xs-center"><img v-if="props.item.image" :src="props.item.image" width="130" height="40" /><span
            v-else>无</span></td>
        <td class="text-xs-center">{{ props.item.letter }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon @click="editBrand(props.item)">
            <i class="el-icon-edit" />
          </v-btn>
          <v-btn icon @click="deleteBrand(props.item)">
            <i class="el-icon-delete" />
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-dialog max-width="500" v-model="show" persistent scrollable>
      <v-card>
        <!--对话框的标题-->
        <v-toolbar dense dark color="primary">
          <v-toolbar-title>{{isEdit ? '修改' : '新增'}}品牌</v-toolbar-title>
          <v-spacer />
          <!--关闭窗口的按钮-->
          <v-btn icon @click="closeWindow">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <!--对话框的内容，表单-->
        <v-card-text class="px-5" style="height:400px">
          <brand-form @close="closeWindow" :oldBrand="oldBrand" :isEdit="isEdit" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import BrandForm from './BrandForm'
  export default {
    name: "brand",
    components: {
      'brand-form': BrandForm
    },
    data() {
      return {
        search: '',
        show: false,
        isEdit: false,
        totalBrands: 0,
        pagination: {},
        loading: false,
        headers: [ // 头信息
          {
            text: 'id',
            align: 'center',
            value: 'id'
          },
          {
            text: '名称',
            align: 'center',
            value: 'name',
            sortable: false
          },
          {
            text: 'LOGO',
            align: 'center',
            value: 'image',
            sortable: false
          },
          {
            text: '首字母',
            align: 'center',
            value: 'letter'
          },
        ],
        brands: [],
        oldBrand: {}
      }
    },
    methods: {
      addBrand() {
        this.show = true;
        this.isEdit = false;
        this.oldBrand = null
      },
      getDataFromServer() { // 从服务的加载数的方法。
        // 发起请求
        this.$http.get("/item/brand/page", {
          params: {
            key: this.search, // 搜索条件
            page: this.pagination.page, // 当前页
            rows: this.pagination.rowsPerPage, // 每页大小
            sortBy: this.pagination.sortBy, // 排序字段
            desc: this.pagination.descending // 是否降序
          }
        }).then(resp => { // 这里使用箭头函数
          this.brands = resp.data.items;
          this.totalBrands = resp.data.total;
          // 完成赋值后，把加载状态赋值为false
          this.loading = false;
        })
      },
      editBrand(oldBrand) {
        this.$http.get("/item/category/bid/" + oldBrand.id).then((res) => {
          console.log(res)
          this.show = true
          this.isEdit = true
          this.oldBrand = oldBrand
          this.oldBrand.categories = res.data
        })

        console.log(oldBrand)
      },
      deleteBrand(oldBrand) {
        console.log(oldBrand)
      },
      closeWindow() {
        // 重新加载数据
        this.getDataFromServer();
        // 关闭窗口
        this.show = false;
      }
    },
    watch: {
      pagination: { // 监视pagination属性的变化
        deep: true, // deep为true，会监视pagination的属性及属性中的对象属性变化
        handler() {
          console.log('watch pagination:' + this.pagination)
          // 变化后的回调函数，这里我们再次调用getDataFromServer即可
          this.getDataFromServer();
        }
      },
      search: { // 监视搜索字段
        handler() {
          console.log('watch search:' + this.search)
          this.getDataFromServer();
        }
      }
    },
    mounted() {
      console.log(this.pagination)
    }
  }
</script>

<style>
</style>
