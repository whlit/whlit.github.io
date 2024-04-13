<template>
  <div v-html="svgRef"></div>
</template>
<script setup ts>
import { ref, onMounted } from 'vue'
import { render } from '../script/mermaid'

const props = defineProps({
  id: String,
  code: String,
})

onMounted(async () => {
  svgRef.value = await render(props.id, decodeURIComponent(props.code))
})

const svgRef = ref('')
</script>
<style scoped></style>
