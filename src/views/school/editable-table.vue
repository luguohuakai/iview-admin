<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
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
                <!--<FormItem label="背景图" prop="login_bg">-->
                    <!--<Input elementId="login_bg" v-model="formItem.login_bg" type="file"></Input>-->
                <!--</FormItem>-->
                <!--<FormItem label="Logo" prop="logo">-->
                    <!--<Input elementId="logo" v-model="formItem.logo" type="file"></Input>-->
                    <!--&lt;!&ndash;<input type="file" name="logo" id="logo" v-model="formItem.logo">&ndash;&gt;-->
                <!--</FormItem>-->
                <FormItem label="颜色" prop="color">
                    <ColorPicker v-model="formItem.color"/>
                </FormItem>

                <FormItem label="Logo" prop="logo">
                    <div>
                        <Upload
                                :before-upload="handleUpload"
                                action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="ghost" icon="ios-cloud-upload-outline">Select the file to upload</Button>
                        </Upload>
                        <div v-if="file !== null">Upload file: {{ file.name }} <Button type="text" @click="upload" :loading="loadingStatus">{{ loadingStatus ? 'Uploading' : 'Click to upload' }}</Button></div>
                    </div>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="text" @click="cancel" style="margin-right: 8px">取消</Button>
                <Button type="primary" @click="submit" :loading="modalSetting.loading">确定</Button>
            </div>
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
          file: null,
          loadingStatus: false,
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
          name: '',
          addr: '',
          lat: '',
          lng: '',
          color: '',
          logo: '',
          login_bg: '',
          id: 0
        },
        formInline: {
          name: '',
          addr: ''
        }
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
        handleUpload (file) {
            this.file = file;
            return false;
        },
        upload () {
            this.loadingStatus = true;
            setTimeout(() => {
                this.file = null;
                this.loadingStatus = false;
                this.$Message.success('Success')
            }, 1500);
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
              target = 'school';
                axios.post(target, self.formItem).then(function (response) {
                    if (response.data.code === 1) {
                        self.$Message.success(response.data.msg);
                    } else {
                        self.$Message.error(response.data.msg);
                    }
                    self.setData();
                    self.cancel();
                });
            } else {
              target = 'school/' + this.formItem.id;
                axios.put(target, self.formItem).then(function (response) {
                    if (response.data.code === 1) {
                        self.$Message.success(response.data.msg);
                    } else {
                        self.$Message.error(response.data.msg);
                    }
                    self.setData();
                    self.cancel();
                });
            }
          }
        });
      }
    },
    created () {
      this.setColumns();
      this.setData();
    }
  };

  window.addEventListener('message', function (event) {
    // 接收位置信息，用户选择确认位置点后选点组件会触发该事件，回传用户的位置信息
    let loc = event.data;
    if (loc && loc.module === 'locationPicker') {
      // 防止其他应用也会向该页面post信息，需判断module是否为'locationPicker'
        this.default.data.formItem.name = loc.poiname;
        this.default.data.formItem.addr = loc.poiaddress;
        this.default.data.formItem.lat = loc.latlng.lat;
        this.default.data.formItem.lng = loc.latlng.lng;
      // document.getElementById('name').value = loc.poiname;
      // document.getElementById('addr').value = loc.poiaddress;
      // document.getElementById('lat').value = loc.latlng.lat;
      // document.getElementById('lng').value = loc.latlng.lng;
    }
  }, false);
</script>
