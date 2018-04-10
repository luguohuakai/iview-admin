<style lang="less">
    @import '../../styles/common.less';
    @import './components/table.less';
</style>

<template>
    <div>
        <Row>
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="load-b"></Icon>
                        简单说明
                    </p>
                </Card>
            </Col>
        </Row>
        <Row class="margin-top-10">
            <Col span="24">
                <Card>
                    <p slot="title">
                        <Icon type="android-remove"></Icon>
                        可编辑单元行
                    </p>
                    <div class="edittable-table-height-con">
                        <can-edit-table refs="table2" v-model="editInlineData" :columns-list="editInlineColumns" @on-delete="handleDel" @on-change="handleChange"></can-edit-table>
                    </div>
                </Card>
            </Col>
        </Row>
    </div>
</template>

<script>
import canEditTable from './components/canEditTable.vue';
import tableData from './components/table_data.js';
export default {
    name: 'editable-table',
    components: {
        canEditTable
    },
    data () {
        return {
            editInlineColumns: [],
            editInlineData: []
        };
    },
    methods: {
        getData () {
            this.editInlineColumns = tableData.editInlineColumns;
            this.editInlineData = tableData.editInlineData;
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
            console.log(val);
            this.$Message.success('删除了第' + (index + 1) + '行数据:');
        },
        handleChange (val, index) {
            console.log(val);
            this.$Message.success('修改了第' + (index + 1) + '行数据:');
        }
    },
    created () {
        this.getData();
    }
};
</script>
