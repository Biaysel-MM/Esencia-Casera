<template>
  <div class="min-h-screen bg-linear-to-br from-[#F6F9F6] via-white to-[#D8EBD0] flex items-center justify-center p-8">
    <div class="max-w-md text-center">
      <!-- Animated Illustration -->
      <div class="relative mb-8">
        <div class="absolute inset-0 animate-pulse rounded-full bg-[rgba(93,162,113,0.2)] blur-xl"></div>
        <div class="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg">
          <span class="iconify text-6xl text-[#5DA271]" data-icon="mdi:food-variant-off"></span>
        </div>
      </div>

      <!-- 404 Number with creative styling -->
      <div class="mb-4 flex justify-center gap-2 text-8xl font-black tracking-tighter">
        <span class="bg-linear-to-br from-[#5DA271] to-[#8BB174] bg-clip-text text-transparent animate-bounce" style="animation-delay: 0s">4</span>
        <span class="bg-linear-to-br from-[#8BB174] to-[#A8D5BA] bg-clip-text text-transparent animate-bounce" style="animation-delay: 0.2s">0</span>
        <span class="bg-linear-to-br from-[#5DA271] to-[#8BB174] bg-clip-text text-transparent animate-bounce" style="animation-delay: 0.4s">4</span>
      </div>

      <h2 class="mb-3 text-2xl font-bold text-[#2C2C2C]">¡Ups! Receta no encontrada</h2>
      
      <p class="mb-6 text-[#6C7A6C] leading-relaxed">
        Parece que esta receta se ha escapado de la cocina...<br>
        No te preocupes, tenemos muchas otras delicias para ti.
      </p>

      <!-- Decorative elements -->
      <div class="mb-8 flex justify-center gap-2">
        <div class="h-1.5 w-8 rounded-full bg-[#5DA271]"></div>
        <div class="h-1.5 w-3 rounded-full bg-[#8BB174]"></div>
        <div class="h-1.5 w-3 rounded-full bg-[#A8D5BA]"></div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button 
          @click="goHome" 
          class="group flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#5DA271] px-6 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[rgba(93,162,113,0.9)] hover:shadow-lg"
        >
          <span class="iconify text-xl" data-icon="mdi:home-outline"></span>
          <span>Volver al inicio</span>
          <span class="iconify text-lg transition-transform duration-300 group-hover:translate-x-1" data-icon="mdi:arrow-right"></span>
        </button>
        
        <button 
          @click="goToRecetas" 
          class="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[rgba(93,162,113,0.3)] bg-white px-6 py-3 font-medium text-[#5DA271] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#5DA271] hover:bg-[rgba(93,162,113,0.05)] hover:shadow-md"
        >
          <span class="iconify text-xl" data-icon="mdi:book-open"></span>
          <span>Explorar recetas</span>
        </button>
      </div>

      <!-- Funny cooking quote -->
      <div class="mt-8 rounded-xl bg-white/60 p-4 backdrop-blur-sm">
        <p class="text-sm italic text-[#6C7A6C]">
          "Una buena receta siempre encuentra su camino de regreso a casa"
          <span class="block text-xs text-[#8BB174] mt-1">— El Chef Virtual</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView',
  methods: {
    goHome() {
      this.$router.push('/home')
    },
    goToRecetas() {
      this.$router.push('/recetas')
    }
  }
}
</script>