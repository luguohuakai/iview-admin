<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie';
import axios from 'axios';
export default {
    data () {
        return {
            form: {
                username: 'root',
                password: '123456'
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.loginForm.validate((valid) => {
              if (valid) {
                let vm = this;
                axios.post('admin/Login/index', {
                  username: vm.form.username,
                  password: vm.form.password
                }).then(function (response) {
                  let data = response.data;
                  if (data.code === 1) {
                    Cookies.set('user', vm.form.username);
                    Cookies.set('password', vm.form.password);
                    vm.$store.commit('setAvator', 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3448484253,3685836170&fm=27&gp=0.jpg');

                    localStorage.accesses = JSON.stringify(data.data.access);

                    vm.$store.commit('login', response.data.data);
                    vm.$Message.success(response.data.msg);
                    vm.$router.push({
                      name: 'home_index'
                    });
                  } else {
                    vm.$Message.error(response.data.msg);
                  }
                });
              }
            });
        }
    }
};
</script>

<style>

</style>
