<template>
  <div class="login">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="login"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Email"
        name="email"
        :rules="[{ required: true, message: 'Por favor digite seu email' }]"
      >
        <a-input v-model:value="formState.email" />
      </a-form-item>
  
      <a-form-item
        label="Senha"
        name="password"
        :rules="[{ required: true, message: 'Por favor digite sua senha' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>
  
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">Entrar</a-button>
      </a-form-item>

      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
        <!-- <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox> -->
        <span style="color:darkcyan;cursor: pointer;" @click="showModal">Cadastrar-se</span>
      </a-form-item>
  
    </a-form>
  </div>
  <!-- cadastro -->
  <div>
    <a-modal
        v-model:visible="visible"
        title="Cadastrar-se"
        :confirm-loading="confirmLoading"
        @ok="salvarCadastro"
      >
        <!-- <p>{{ modalText }}</p> -->

        <a-form
          :model="formStateCadastro"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinishCadastro"
        >
          <a-form-item :name="['name']" label="Nome" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.name" />
          </a-form-item>
          <a-form-item :name="['cpf']" label="Cpf" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.cpf" />
          </a-form-item>
          <a-form-item :name="['type']" label="Tipo" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.type" />
          </a-form-item>
          <a-form-item :name="['phone']" label="Telefone" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.phone" />
          </a-form-item>
          <a-form-item :name="['email']" label="Email" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.email" />
          </a-form-item>
          <a-form-item :name="['password']" label="Senha" :rules="[{ required: true }]">
            <a-input v-model:value="formStateCadastro.password" />
          </a-form-item>
          <!-- <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item> -->
        </a-form>
      </a-modal>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue';
import { notification } from 'ant-design-vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';
export default defineComponent({
  setup() {
    
    const router = useRouter()
    const route = useRoute()

    // loginSubmit
    
    const formState = reactive({
      email: '',
      password: '',
      remember: true,
    });
    const onFinish = async values => {
      console.log('Success:', values);
    };
    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo);
    };

    async function login() {
        
        await axios.post("https://apresentaoteste.shop/api/login",{
          email: formState.email,
          password: formState.password
        }).then(response => { 
          const data = response?.data?.hasOwnProperty('status') ? {...response?.data} : [] ;
          
          if(data.status){
            router.push({name: 'dashboard'})
            return;
          }
          
          notification.open({
            message: 'Erro',
            description: data.message,
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });

        }).catch(error => {
          notification.open({
            message: 'Erro',
            description: error.response.data.message,
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
        }).finally(() => {
        })
    }

    // modal cadastro

    const visible = ref(false);
    const confirmLoading = ref(false);
    const showModal = () => {
      visible.value = true;
    };
    const salvarCadastro = async () => {
      confirmLoading.value = true;

      const newData = {
        name: `${formStateCadastro.name}`,
        cpf: `${formStateCadastro.cpf}`,
        type: `${formStateCadastro.type}`,
        phone: `${formStateCadastro.phone}`,
        email: `${formStateCadastro.email}`,
        password: `${formStateCadastro.password}`,
      };
      
      await axios.post(`https://apresentaoteste.shop/api/register`,{...newData}).then(response => {
        const data = response?.data?.hasOwnProperty('id') ? {...response?.data} : [] ;
        router.push({name: 'dashboard'})
        visible.value = false;
      }).catch(error => {
          notification.open({
            message: 'Erro',
            description: error.response.data.message,
            onClick: () => {
              console.log('Notification Clicked!');
            },
          });
      }).finally(() => {

        formState.name;
        formState.cpf;
        formState.type;
        formState.phone;
        formState.email;
        formState.password;

        confirmLoading.value = false;
      })
    };

    // modal form cadastro

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

    const validateMessages = {
      required: '${label} is required!'
    };

    const formStateCadastro = reactive({
      name: '',
      cpf: '',
      type: '',
      phone: '',
      email: '',
      password: ''
    });

    const onFinishCadastro = (values) => {
      // console.log('Success:', values);
    };

    return {
      formState,
      onFinish,
      onFinishFailed,
      login,

      visible,
      confirmLoading,
      showModal,
      salvarCadastro,

      formStateCadastro,
      onFinishCadastro,
      layout,
      validateMessages,
    };
  },
});
</script>

<style>
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }
  .login .ant-form.ant-form-horizontal {
    width: 300px !important;
  }
  .login .ant-col.ant-col-16.ant-col-offset-8.ant-form-item-control {
    width: 100px !important;
    max-width: 100px;
  }
</style>