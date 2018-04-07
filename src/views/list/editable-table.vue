<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <!-- 搜索栏 -->
        <Card>
            <Row>
                <Col span="6">
                <Input placeholder="搜索关键字"></Input>
                </Col>
                <Col span="6" class="padding-left-10">
                <Button type="primary" icon="search">搜索</Button>
                </Col>
            </Row>
        </Card>
        <!-- 列表栏 -->
        <Row class="margin-top-10">
            <Col span="24">
            <Card>
                <p slot="title" style="height: 32px;">
                    <Button type="primary" icon="plus-round" @click="modal10 = true">新增</Button>
                </p>
                <div class="edittable-table-height-con">
                    <can-edit-table
                            refs="table2"
                            v-model="editInlineData"
                            :columns-list="editInlineColumns"
                            @on-cell-change="handleCellChange"
                            @on-change="handleChange"
                            @on-delete="handleDel">
                    </can-edit-table>
                </div>
            </Card>
            </Col>
        </Row>

        <!-- "搜索"弹出层 -->
        <Modal
                title="Title"
                v-model="modal10"
                class-name="vertical-center-modal">
            <p>Content of dialog</p>
            <p>Content of dialog</p>
            <p>Content of dialog</p>
        </Modal>
    </div>
</template>

<script>
    import canEditTable from './components/canEditTable.vue';
    import tableData from './components/table_data.js';
    import axios from 'axios';

    export default {
        // 自定义名称
        name: 'editable-table',
        // 组件位置
        components: {
            canEditTable
        },
        // 初始化数据
        data () {
            return {
                editInlineColumns: [],
                editInlineData: [],
                showCurrentTableData: false,
                modal10: false
            };
        },
        // 自定义方法
        methods: {
            getData () {
                // this.editInlineColumns = tableData.editInlineColumns; // 初始化获取数据(一般是从接口获取)
                // this.editInlineData = tableData.editInlineData;
                this.setColumns();
                this.getList();
            },
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
                this.$Message.success('删除了第' + (index + 1) + '行数据');
            },
            handleCellChange (val, index, key) {
                this.$Message.success('修改了第 ' + (index + 1) + ' 行列名为 ' + key + ' 的数据');
            },
            handleChange (val, index) {
                this.$Message.success('修改了第' + (index + 1) + '行数据');
            },
            getList () {
                axios.get('ac').then(res => {
                    this.editInlineData = res.data.data.data;
                });
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
                        title: 'ID',
                        align: 'center',
                        key: 'id',
                        width: 90,
                        editable: true
                    },
                    {
                        title: 'AC_ID',
                        align: 'center',
                        key: 'ac_id'
                    },
                    {
                        title: '学校ID',
                        align: 'center',
                        key: 'school_id',
                        width: 150,
                        editable: true
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'note',
                        width: 150,
                        editable: true
                    },
                    {
                        title: '操作',
                        align: 'center',
                        width: 190,
                        key: 'handle',
                        handle: ['edit', 'delete']
                    }
                ];
            }
        },
        // 页面一加载就执行的方法
        created () {
            this.getData();
        }
    };
</script>
