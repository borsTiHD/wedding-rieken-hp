<script setup lang="ts">
const riddle = [
  'Im Schatten der Liebe, verborgen und klein, wartet ein Spiel auf dich, es könnte nicht besser sein.',
  'Die Geister tanzen, verborgen vor deinem Blick, doch du kannst es finden mit einem kleinen Tipp.',
  'Ein Wort mit drei Buchstarben, das sie flüstern, das weißt du bestimmt, misch sie an die URL, bis das richtige stimmt.',
  'Dann öffnet sich das Spiel, die Geister sind frei, und du kannst sie jagen, mit großem Geschrei. 👻',
]
</script>

<template>
  <Card class="grow">
    <template #content>
      <IconBackground icon="pi-lock" />
      <div class="flex flex-col items-center gap-2">
        <p v-for="(line, index) in riddle" :key="index" class="italic">
          {{ line }}
        </p>
      </div>
    </template>
  </Card>
</template>
