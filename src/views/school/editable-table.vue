<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';

    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

<template>
    <div>

        <Card>
            <Row>
                <Col span="24">
                    <Form ref="formInline" :model="formInline" inline>
                        <FormItem prop="name">
                            <Input type="text" v-model="formInline.name" placeholder="学校名称">
                            <!--<Icon type="ios-person-outline" slot="prepend"></Icon>-->
                            </Input>
                        </FormItem>
                        <FormItem prop="addr">
                            <Input type="text" v-model="formInline.addr" placeholder="地址">
                            <!--<Icon type="ios-locked-outline" slot="prepend"></Icon>-->
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button type="ghost" icon="ios-search" @click="search('formInline')">搜索</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </Card>

        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" style="height: 32px">
                    <!--<Icon type="social-buffer"></Icon>-->
                    <!--列表-->
                    <Button type="primary" @click="alertAdd" icon="plus-round">新增</Button>
                </p>
                <div class="edittable-table-height-con">
                    <can-edit-table refs="table2" v-model="editInlineData" :columns-list="editInlineColumns"
                                    @on-delete="handleDel" @on-change="handleChange"></can-edit-table>
                </div>
                <div style="margin: 10px;overflow: hidden">
                    <div style="float: right;">
                        <Page :total="total" :current="current" ></Page>
                    </div>
                </div>
            </Card>
            </Col>
        </Row>

        <Modal v-model="modalSetting.show" width="668" :styles="{top: '30px'}" @on-visible-change="doCancel">
            <p slot="header" style="color:#2d8cf0;">
                <Icon type="information-circled"></Icon>
                <span>{{formItem.id ? '编辑' : '新增'}}</span>
            </p>
            <Form ref="myForm" :model="formItem" :label-width="80">
                <FormItem label="搜索位置" prop="search">
                    <div>
                        <iframe id="mapPage" width="400" height="300" frameborder="0" src="https://apis.map.qq.com/tools/locpicker?search=1&type=1&key=363BZ-XLIKS-EIZOP-6PQGH-5W3YQ-X3B2J&referer=myapp"></iframe>
                    </div>
                </FormItem>
                <FormItem label="学校名称" prop="name">
                    <Input elementId="name" v-model="formItem.name" placeholder="请输入学校名称"></Input>
                </FormItem>
                <FormItem label="学校地址" prop="addr">
                    <Input elementId="addr" v-model="formItem.addr" placeholder="请输入学校地址"></Input>
                </FormItem>
                <FormItem label="纬度" prop="lat">
                    <Input elementId="lat" v-model="formItem.lat" placeholder="请输入学校纬度"></Input>
                </FormItem>
                <FormItem label="经度" prop="lng">
                    <Input elementId="lng" v-model="formItem.lng" placeholder="请输入学校经度"></Input>
                </FormItem>



                <FormItem label="颜色" prop="color">
                    <Input v-model="formItem.color" placeholder="请输入颜色"></Input>
                </FormItem>



                <FormItem label="Logo" prop="logo">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <input v-if="formItem.logo" v-model="formItem.logo" type="hidden" name="logo">
                    <Upload
                            ref="upload"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="//jsonplaceholder.typicode.com/posts/"
                            style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                </FormItem>


            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
            </div>
        </Modal>

        <Modal title="View Image" v-model="visible">
            <img :src="'https://o5wwk8baw.qnssl.com/' + imgName + '/large'" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
  /* eslint-disable indent,no-unneeded-ternary */

  import canEditTable from './components/canEditTable.vue';
  import axios from 'axios';

  export default {
    name: 'editable-table',
    components: {
      canEditTable
    },
    data () {
      return {
        editInlineColumns: [],
        editInlineData: [],
        total: 0,
        current: 1,
        modalSetting: {
          show: false,
          loading: false,
          index: 0
        },
        formItem: {
          apiClass: '',
          info: '',
          groupHash: 'default',
          method: 2,
          hash: '',
          accessToken: 1,
          isTest: 0,
          needLogin: 0,
          id: 0
        },
        formInline: {
          name: '',
          addr: ''
        },
        defaultList: [
          {
            'name': 'a42bdcc1178e62b4694c830f028db5c0',
            'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
          },
          {
            'name': 'bc7521e033abdd1e92222d733590f104',
            'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
          }
        ],
        imgName: '',
        visible: false,
        uploadList: []
      };
    },
    methods: {
      handleNetConnect (state) {
        this.breakConnect = state;
      },
      handleLowSpeed (state) {
        this.lowNetSpeed = state;
      },
      getCurrentData () {
        this.showCurrentTableData = true;
      },
      handleDel (val, index) {
        // console.log(val);
        this.$Message.success('删除了第' + (index + 1) + '行数据:');
      },
      handleChange (val, index) {
        // console.log(val);
        this.$Message.success('修改了第' + (index + 1) + '行数据:');
      },
      setColumns () {
        this.editInlineColumns = [
          {
            title: '序号',
            type: 'index',
            width: 80,
            align: 'center'
          },
          {
            title: '学校名称',
            align: 'center',
            key: 'name',
            editable: true
          },
          {
            title: '纬度',
            align: 'center',
            key: 'lat'
          },
          {
            title: '经度',
            align: 'center',
            key: 'lng',
            editable: true
          },
          {
            title: '地址',
            align: 'center',
            key: 'addr',
            editable: true
          },
          {
            title: '颜色',
            align: 'center',
            key: 'color',
            editable: true
          },
          {
            title: 'Logo',
            align: 'center',
            key: 'logo',
            editable: true
          },
          {
            title: '背景',
            align: 'center',
            key: 'login_bg',
            editable: true
          },
          {
            title: '操作',
            align: 'center',
            key: 'handle',
            handle: ['edit', 'delete']
          }
        ];
      },
      setData (page, size, keywords) {
        let params = {};
        params.page = page ? page : 1;
        params.size = size ? size : 10;
        if (keywords) params = Object.assign(params, keywords);
        axios.get('school', {
          params: params
        }).then(res => {
          if (res.data.code === 1) {
            this.editInlineData = res.data.data.data;
            this.total = res.data.data.total;
            this.current = res.data.data.current_page;
          } else {
            this.$Message.error(res.data.msg);
          }
        });
      },
      search (name) {
        let vm = this;
        let params = {};
        params.like = {};
        if (vm.formInline.name) params.like.name = vm.formInline.name;
        if (vm.formInline.addr) params.like.addr = vm.formInline.addr;
        this.setData(false, false, params);
      },
      alertAdd () {
        let vm = this;
//        axios.get('InterfaceList/getHash').then(function (response) {
//          let res = response.data;
//          if (res.code === 1) {
//            vm.formItem.hash = res.data.hash;
//          } else {
//            if (res.code === -14) {
//              vm.$store.commit('logout', vm);
//              vm.$router.push({
//                name: 'login'
//              });
//            } else {
//              vm.$Message.error(res.msg);
//            }
//          }
//        });
        this.modalSetting.show = true;
      },
      doCancel (data) {
        if (!data) {
          this.formItem.id = 0;
          this.$refs['myForm'].resetFields();
          this.modalSetting.loading = false;
          this.modalSetting.index = 0;
        }
      },
      cancel () {
        this.modalSetting.show = false;
      },
      submit () {
        let self = this;
        this.$refs['myForm'].validate((valid) => {
          if (valid) {
            self.modalSetting.loading = true;
            let target = '';
            if (this.formItem.id === 0) {
              target = 'InterfaceList/add';
            } else {
              target = 'InterfaceList/edit';
            }
            axios.post(target, self.formItem).then(function (response) {
              if (response.data.code === 1) {
                self.$Message.success(response.data.msg);
              } else {
                self.$Message.error(response.data.msg);
              }
              self.getList();
              self.cancel();
            });
          }
        });
      },
      handleView (name) {
        this.imgName = name;
        this.visible = true;
      },
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      handleSuccess (res, file) {
        file.url = 'https://o5wwk8baw.qnssl.com/7eb99afb9d5f317c912f08b5212fd69a/avatar';
        file.name = '7eb99afb9d5f317c912f08b5212fd69a';
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: 'The file format is incorrect',
          desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: 'Exceeding file size limit',
          desc: 'File  ' + file.name + ' is too large, no more than 2M.'
        });
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
            title: 'Up to five pictures can be uploaded.'
          });
        }
        return check;
      }
    },
    created () {
      this.setColumns();
      this.setData();
    },
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    }
  };

  window.addEventListener('message', function (event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    let loc = event.data;
    if (loc && loc.module === 'locationPicker') {
      // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
      document.getElementById('name').value = loc.poiname;
      document.getElementById('addr').value = loc.poiaddress;
      document.getElementById('lat').value = loc.latlng.lat;
      document.getElementById('lng').value = loc.latlng.lng;
    }
  }, false);
</script>
