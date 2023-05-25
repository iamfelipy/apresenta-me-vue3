<template>
    <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="showModal">Adicionar</a-button>
    <a-table :columns="columns" :data-source="dataSource" bordered :scroll="{ x: 2000 }">
      <template #bodyCell="{ column, text, record }">
        <template v-if="['name', 'cpf', 'type', 'phone', 'email', 'password'].includes(column.dataIndex)">
          <div>
            <a-input
              v-if="editableData[record.key]"
              v-model:value="editableData[record.key][column.dataIndex]"
              style="margin: -5px 0"
            />
            <template v-else>
              {{ text }}
            </template>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <span v-if="editableData[record.key]">
            <a-typography-link @click="saveEdit(record.key)">Salvar&nbsp;</a-typography-link>
            <a-popconfirm title="Tem certeza?" cancelText="Não" okText="Sim" @confirm="cancelEdit(record.key)">
              <a>Cancelar</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record.key)">Editar</a>
          </span>
          <a-divider type="vertical" />
          <a-popconfirm
            v-if="dataSource.length"
            title="Tem certeza?"
            @confirm="onDelete(record.key)"
            cancelText="Não" okText="Sim"
          >
            <a>Deletar</a>
          </a-popconfirm>
          </template>
      </template>
      <template #emptyText="">
        Sem registros
      </template>
    </a-table>
    <!-- modal form -->
    <div>
      <a-modal
        v-model:visible="visible"
        title="Adicionar novo usuário"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
      >
        <!-- <p>{{ modalText }}</p> -->

        <a-form
          :model="formState"
          v-bind="layout"
          name="nest-messages"
          :validate-messages="validateMessages"
          @finish="onFinish"
        >
          <a-form-item :name="['name']" label="Nome" :rules="[{ required: true }]">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item :name="['cpf']" label="Cpf" :rules="[{ required: true }]">
            <a-input v-model:value="formState.cpf" />
          </a-form-item>
          <a-form-item :name="['type']" label="Tipo" :rules="[{ required: true }]">
            <a-input v-model:value="formState.type" />
          </a-form-item>
          <a-form-item :name="['phone']" label="Telefone" :rules="[{ required: true }]">
            <a-input v-model:value="formState.phone" />
          </a-form-item>
          <a-form-item :name="['email']" label="Email" :rules="[{ required: true }]">
            <a-input v-model:value="formState.email" />
          </a-form-item>
          <a-form-item :name="['password']" label="Senha" :rules="[{ required: true }]">
            <a-input v-model:value="formState.password" />
          </a-form-item>
          <!-- <a-form-item :wrapper-col="{ ...layout.wrapperCol, offset: 8 }">
            <a-button type="primary" html-type="submit">Submit</a-button>
          </a-form-item> -->
        </a-form>
      </a-modal>
    </div>
  </template>
  <script lang="ts">
  import { cloneDeep } from 'lodash-es';
  import { computed, defineComponent, reactive, ref } from 'vue';
  import { notification } from 'ant-design-vue';
  import axios from 'axios';
  import type { Ref, UnwrapRef } from 'vue';
  
  const columns = [
  {
      title: 'Nome',
      dataIndex: 'name',
      // width: '25%',
    },
    {
      title: 'CPF',
      dataIndex: 'cpf',
      // width: '15%',
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      // width: '40%',
    },
    {
      title: 'Telefone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Password',
      dataIndex: 'password',
    },
    {
      title: 'Ações',
      dataIndex: 'operation',
    },
  ];
  interface DataItem {
    key: string;
    name: string;
    cpf: string;
    type: string;
    phone: string;
    email: string;
    password: string;
  }
  const data: DataItem[] = [];
  // for (let i = 0; i < 3; i++) {
  //   data.push({
  //     key: i.toString(),
  //     nome: `Edrward ${i}`,
  //     cpf: '32',
  //     tipo: `London Park no. ${i}`,
  //     telefone: `London Park no. ${i}`,
  //     email: `London Park no. ${i}`,
  //   });
  // }

  export default defineComponent({
    setup() {
      
      //config modal

      const modalText = ref<string>('Content of the modal');
      const visible = ref<boolean>(false);
      const confirmLoading = ref<boolean>(false);

      const showModal = () => {
        visible.value = true;
      };

      const handleOk = async () => {
        confirmLoading.value = true;

        const newData = {
          name: `${formState.name}`,
          cpf: `${formState.cpf}`,
          type: `${formState.type}`,
          phone: `${formState.phone}`,
          email: `${formState.email}`,
          password: `${formState.password}`,
        };

        await axios.post(`https://apresentaoteste.shop/api/save`,{...newData}).then(response => {
          const data = response?.data?.hasOwnProperty('id') ? {...response?.data} : [] ;

          dataSource.value.push({
            key: data.id,
            name: `${data.name}`,
            cpf: `${data.cpf}`,
            type: `${data.type}`,
            phone: `${data.phone}`,
            email: `${data.email}`,
            password: `${data.password}`
          });
          
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

      //config form modal

      const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 },
      };

      const validateMessages = {
        required: '${label} is required!'
      };

      const formState = reactive({
        name: '',
        cpf: '',
        type: '',
        phone: '',
        email: '',
        password: '',
      });

      const onFinish = (values: any) => {
        console.log('Success:', values);
      };

      //config table
      
      const dataSource = ref(data);
      const count = computed(() => dataSource.value.length + 1);
      const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});
  
      const edit = (key: string) => {
        editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]);
      };
      const saveEdit = async (key: string) => {        
        const userEdit = editableData[key];

        await axios.put(`https://apresentaoteste.shop/api/update/${userEdit.key}`,{
          name: userEdit.name,
          cpf: userEdit.cpf,
          type: userEdit.type,
          phone: userEdit.phone,
          email: userEdit.email,
          password: userEdit.password,
        }).then(response => {  
          Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]);
          delete editableData[key];
        }).finally(() => {
        })

      };
      const cancelEdit = (key: string) => {
        delete editableData[key];
      };
      const onDelete = async (key: string) => {

        await axios.delete(`https://apresentaoteste.shop/api/delete/${key}`).then(response => {  
          dataSource.value = dataSource.value.filter(item => item.key !== key);
        }).finally(() => {
          
        })
        
      };
      async function getUsers() {
        // loading.value = true;
        await axios.get("https://apresentaoteste.shop/api/user").then(response => {
          const data = response?.data?.length > 0 ? [...response.data] : [] ;

          // cpf: "15423642588"
          // created_at: "2023-05-23T18:32:11.000000Z"
          // email: "jose@gmail.com"
          // id: 2
          // nome: "jose"
          // telefone: "47944889988"
          // tipo: "juridica"
          // updated_at: "2023-05-23T18:32:11.000000Z"

          dataSource.value = data.map(item => {
            return {
              key: item.id.toString(),
              name: item.name,
              cpf: item.cpf,
              type: item.type,
              phone: item.phone,
              email: item.email,
              password: item.password,
            }
          });

        }).finally(() => {
          // loading.value = false;
        })
      }

      return {
        dataSource,
        columns,
        editingKey: '',
        editableData,
        edit,
        saveEdit,
        cancelEdit,
        onDelete,
        getUsers,

        modalText,
        visible,
        confirmLoading,
        showModal,
        handleOk,

        formState,
        onFinish,
        layout,
        validateMessages,
      };
    },
    async created() {
      await this.getUsers()
    }
  });
  </script>
  <style scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }
  </style>
  