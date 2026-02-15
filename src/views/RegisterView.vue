<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Separator from '@/components/ui/separator/Separator.vue'
import { X } from 'lucide-vue-next'

// Novas variáveis para os campos
const firstName = ref('')
const lastName = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')

const newTech = ref('')
const availableTechs = [
  'Vue.js',
  'React',
  'Node.js',
  'TypeScript',
  'Tailwind CSS',
  'SQL Server',
  'Java',
  'Python',
]
const technologies = ref<string[]>(['Vue.js'])

const filteredTechs = computed(() => {
  return availableTechs.filter(
    (t) => t.toLowerCase().includes(newTech.value.toLowerCase()) && !technologies.value.includes(t),
  )
})

const addTech = (techName?: string) => {
  const tech = typeof techName === 'string' ? techName : newTech.value.trim()
  if (tech && availableTechs.includes(tech) && !technologies.value.includes(tech)) {
    technologies.value.push(tech)
  }
  newTech.value = ''
}

const removeTech = (techToRemove: string) => {
  technologies.value = technologies.value.filter((tech) => tech !== techToRemove)
}
const handleSubmit = () => {
  // Lógica para enviar os dados do formulário
  if (!firstName.value || !lastName.value || !email.value || !password.value) {
    alert('Por favor, preencha todos os campos obrigatórios.')
    return
  }
  const payload = {
    first_name: firstName.value,
    last_name: lastName.value,
    phone: phone.value,
    email: email.value,
    password: password.value,
    technologies: technologies.value,
  }
  console.log('Payload para envio:', payload)
  // TODO: Substituir este console.log pela chamada Axios/Fetch para a API do backend
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-stone-50 p-4 font-sans">
    <Card class="w-full max-w-md shadow-xl border-stone-200 bg-white">
      <CardHeader class="space-y-1 text-center">
        <CardTitle class="text-3xl font-bold tracking-tight text-stone-900"> DevSquad </CardTitle>
        <CardDescription class="text-stone-500">
          Crie sua conta e participe dos projetos
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="firstName">Nome</Label>
            <Input id="firstName" v-model="firstName" type="text" placeholder="Digite seu nome" />
          </div>
          <div class="space-y-2">
            <Label for="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              v-model="lastName"
              type="text"
              placeholder="Digite seu sobrenome"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="phone">Telefone</Label>
          <Input id="phone" v-model="phone" type="tel" placeholder="(99) 99999-9999" />
        </div>

        <div class="space-y-2">
          <Label for="email">Email</Label>
          <Input id="email" v-model="email" type="email" placeholder="Digite seu email" />
        </div>

        <div class="space-y-2">
          <Label for="password">Senha</Label>
          <Input id="password" v-model="password" type="password" required placeholder="********" />
        </div>

        <Separator class="my-5" />

        <div class="space-y-3">
          <Label>Suas tecnologias</Label>
          <div class="flex gap-2">
            <Input
              v-model="newTech"
              list="tech-options"
              placeholder="Selecione uma tecnologia..."
              @keydown.enter.prevent="addTech"
            />
            <datalist id="tech-options">
              <option v-for="tech in filteredTechs" :key="tech" :value="tech" />
            </datalist>

            <Button @click="addTech" type="button" variant="secondary"> Adicionar </Button>
          </div>

          <div class="flex flex-wrap gap-2 mt-2 min-h-[32px] p-1">
            <Badge
              v-for="tech in technologies"
              :key="tech"
              variant="default"
              class="flex items-center gap-1 pl-2 pr-1 py-1 cursor-pointer hover:bg-red-600 transition-colors"
              @click="removeTech(tech)"
              title="Clique para remover"
            >
              {{ tech }}
              <X class="h-3 w-3 ml-1" />
            </Badge>
            <span v-if="technologies.length === 0" class="text-sm text-stone-400 italic">
              Nenhuma tecnologia adicionada.
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter class="flex flex-col gap-4 mt-2">
        <Button @click="handleSubmit" class="w-full h-11 text-base font-semibold shadow-md"
          >Finalizar Cadastro</Button
        >
        <div class="text-sm text-center text-stone-500">
          Já tem uma conta?
          <a href="#" class="text-stone-900 font-medium hover:underline">Faça login</a>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
