<script setup lang="ts">
const products = [
  {
    id: 1,
    rank: 1,
    name: 'Perplexity Labs',
    description: 'Bring your projects to life faster than ever before',
    image: '../assets/test_logo.png',
    tags: ['Productivity', 'Artificial Intelligence', 'Search'],
    comments: 4,
    saves: 348,
  },
  {
    id: 2,
    rank: 2,
    name: 'Odyssey',
    description: 'AI video you can both watch and interact with in real-time',
    image: '/images/odyssey.png',
    tags: ['Artificial Intelligence', 'Games', 'Video'],
    comments: 16,
    saves: 210,
  },
]
</script>

<template>
  <div class="flex py-5 justify-around items-center border-b-2">
    <div>
      <p class="font-semibold pb-2">Category</p>
      <Select>
        <SelectTrigger class="w-[280px]">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Products</SelectLabel>
            <SelectItem value="ai">
              Ai
            </SelectItem>
            <SelectItem value="saas">
              Saas
            </SelectItem>
            <SelectItem value="devtools">
              Devtools
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    <div>
      <p class="font-semibold pb-2">Sort by</p>
      <RadioGroup class="flex" default-value="default">
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r1" value="default" />
          <Label for="r1">Default</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r2" value="latest" />
          <Label for="r2">Latest</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r3" value="trending" />
          <Label for="r3">Trending</Label>
        </div>
      </RadioGroup>

    </div>

    <Button class="p-5">Add Product</Button>
  </div>
  <div class="space-y-4">
    <ProductCard :ranking="1" company="Perplexity Labs"
      description="Bring your projects to life faster than ever before"
      :tags="['Productivity', 'Artificial Intelligence', 'Search']" :likes="2" :comments="353"
      logo="./assets/test_logo.png'" />
  </div>
</template>
