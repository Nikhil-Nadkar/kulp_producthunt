<template>
    <div class="min-h-screen bg-gray-50/50">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <!-- Back Button -->
            <Button variant="ghost" size="sm" @click="$router.back()" class="mb-6 -ml-2">
                <ArrowLeft class="mr-2 h-4 w-4" />
                Back
            </Button>

            <!-- Product Header Card -->
            <Card class="mb-6">
                <CardContent class="p-6">
                    <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <!-- Product Info -->
                        <div class="flex gap-4">
                            <Avatar class="h-16 w-16 rounded-xl">
                                <AvatarImage :src="product.logo" :alt="`${product.company} logo`" />
                                <AvatarFallback class="rounded-xl text-lg font-semibold">
                                    {{ product.company.charAt(0) }}
                                </AvatarFallback>
                            </Avatar>

                            <div class="flex-1 space-y-3">
                                <div class="flex items-center gap-2">
                                    <h1 class="text-2xl font-bold tracking-tight lg:text-3xl">
                                        {{ product.company }}
                                    </h1>
                                    <Button variant="ghost" size="sm" as-child class="h-8 w-8 p-0">
                                        <a :href="product.website" target="_blank" rel="noopener noreferrer">
                                            <ExternalLink class="h-4 w-4" />
                                            <span class="sr-only">Visit website</span>
                                        </a>
                                    </Button>
                                </div>

                                <p class="text-lg text-muted-foreground">
                                    {{ product.description }}
                                </p>

                                <!-- Tags -->
                                <div class="flex flex-wrap gap-2">
                                    <Badge v-for="tag in product.tags" :key="tag" variant="secondary" class="gap-1">
                                        <component :is="getTagIcon(tag)" class="h-3 w-3" />
                                        {{ tag }}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <!-- Vote Button -->
                        <div class="flex justify-center lg:justify-end">
                            <Button :variant="hasVoted ? 'default' : 'outline'" size="lg" @click="handleVote"
                                :disabled="hasVoted" class="flex-col gap-1 h-auto px-6 py-4">
                                <ChevronUp class="h-5 w-5" />
                                <span class="text-base font-semibold">{{ product.votes }}</span>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div class="grid gap-6 lg:grid-cols-3">
                <!-- Main Content -->
                <div class="space-y-6 lg:col-span-2">
                    <!-- Product Description -->
                    <Card>
                        <CardHeader>
                            <CardTitle>About {{ product.company }}</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div class="prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-muted-foreground"
                                v-html="product.fullDescription" />

                            <!-- External Links -->
                            <div class="flex flex-wrap gap-3 pt-4">
                                <Button as-child variant="outline">
                                    <a :href="product.website" target="_blank" rel="noopener noreferrer">
                                        <Globe class="mr-2 h-4 w-4" />
                                        Visit Website
                                    </a>
                                </Button>
                                <Button v-if="product.github" as-child variant="outline">
                                    <a :href="product.github" target="_blank" rel="noopener noreferrer">
                                        <Github class="mr-2 h-4 w-4" />
                                        View on GitHub
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Submitted By -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Submitted by</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage :src="product.submittedBy.avatar" :alt="product.submittedBy.name" />
                                    <AvatarFallback>{{ product.submittedBy.name.charAt(0) }}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p class="font-medium">{{ product.submittedBy.name }}</p>
                                    <p class="text-sm text-muted-foreground">{{ product.submittedBy.role }}</p>
                                    <p class="text-xs text-muted-foreground">
                                        Submitted {{ formatDate(product.submittedAt) }}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Comments Section -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Comments ({{ comments.length }})</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-6">
                            <!-- Add Comment -->
                            <div class="space-y-3">
                                <div class="flex gap-3">
                                    <Avatar class="h-8 w-8">
                                        <AvatarImage :src="currentUser.avatar" :alt="currentUser.name" />
                                        <AvatarFallback>{{ currentUser.name.charAt(0) }}</AvatarFallback>
                                    </Avatar>
                                    <div class="flex-1 space-y-2">
                                        <Textarea v-model="newComment"
                                            placeholder="Share your thoughts about this product..."
                                            class="min-h-[80px] resize-none" @keydown.meta.enter="submitComment"
                                            @keydown.ctrl.enter="submitComment" />
                                        <div class="flex items-center justify-between">
                                            <p class="text-xs text-muted-foreground">
                                                ⌘ + Enter to post
                                            </p>
                                            <Button @click="submitComment" :disabled="!newComment.trim()" size="sm">
                                                Post Comment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <!-- Comments List -->
                            <div class="space-y-4">
                                <div v-for="comment in comments" :key="comment.id" class="flex gap-3">
                                    <Avatar class="h-8 w-8">
                                        <AvatarImage :src="comment.user.avatar" :alt="comment.user.name" />
                                        <AvatarFallback>{{ comment.user.name.charAt(0) }}</AvatarFallback>
                                    </Avatar>
                                    <div class="flex-1 space-y-2">
                                        <div class="flex items-center gap-2 text-sm">
                                            <span class="font-medium">{{ comment.user.name }}</span>
                                            <Badge variant="outline" class="text-xs">
                                                {{ comment.user.role }}
                                            </Badge>
                                            <span class="text-xs text-muted-foreground">
                                                {{ formatDate(comment.createdAt) }}
                                            </span>
                                        </div>
                                        <p class="text-sm leading-relaxed">{{ comment.text }}</p>
                                        <div class="flex items-center gap-4">
                                            <Button variant="ghost" size="sm" @click="toggleCommentLike(comment)"
                                                :class="[
                                                    'h-8 gap-1 px-2',
                                                    comment.hasLiked ? 'text-red-600' : 'text-muted-foreground'
                                                ]">
                                                <Heart class="h-3 w-3" :class="{ 'fill-current': comment.hasLiked }" />
                                                {{ comment.likes }}
                                            </Button>
                                            <Button variant="ghost" size="sm"
                                                class="h-8 gap-1 px-2 text-muted-foreground">
                                                <MessageCircle class="h-3 w-3" />
                                                Reply
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                    <!-- Stats Card -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Stats</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-3">
                            <div class="flex items-center gap-2 text-sm">
                                <TrendingUp class="h-4 w-4 text-muted-foreground" />
                                <span>{{ product.votes }} upvotes</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <MessageSquare class="h-4 w-4 text-muted-foreground" />
                                <span>{{ comments.length }} comments</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm">
                                <Calendar class="h-4 w-4 text-muted-foreground" />
                                <span>Added {{ formatDate(product.submittedAt) }}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <!-- Related Products -->
                    <Card>
                        <CardHeader>
                            <CardTitle>Similar Products</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <div v-for="related in relatedProducts" :key="related.id"
                                class="flex gap-3 cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted/50">
                                <Avatar class="h-10 w-10 rounded-lg">
                                    <AvatarImage :src="related.logo" :alt="related.company" />
                                    <AvatarFallback class="rounded-lg">
                                        {{ related.company.charAt(0) }}
                                    </AvatarFallback>
                                </Avatar>
                                <div class="flex-1 space-y-1">
                                    <p class="text-sm font-medium leading-none">{{ related.company }}</p>
                                    <p class="text-xs text-muted-foreground leading-relaxed">
                                        {{ related.description }}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import {
    ArrowLeft,
    ExternalLink,
    ChevronUp,
    Globe,
    Github,
    Heart,
    MessageCircle,
    TrendingUp,
    MessageSquare,
    Calendar,
    Zap,
    Brain,
    Search,
    Cpu,
    Palette,
    Megaphone,
    Tag
} from 'lucide-vue-next'

interface User {
    id: string
    name: string
    avatar: string
    role: string
}

interface Comment {
    id: string
    text: string
    user: User
    createdAt: string
    likes: number
    hasLiked: boolean
}

interface Product {
    id: string
    company: string
    description: string
    fullDescription: string
    logo: string
    website: string
    github?: string
    tags: string[]
    votes: number
    submittedBy: User
    submittedAt: string
}

// Mock data
const product = ref < Product > ({
    id: '1',
    company: 'Perplexity Labs',
    description: 'Bring your projects to life faster than ever before',
    fullDescription: `
    <p>Perplexity Labs is revolutionizing the way developers and creators approach project development. Our AI-powered platform combines cutting-edge artificial intelligence with intuitive design tools to help you build, iterate, and deploy projects at unprecedented speed.</p>
    
    <h4>Key Features:</h4>
    <ul>
      <li><strong>AI-Powered Code Generation:</strong> Generate high-quality code snippets and entire functions using natural language descriptions</li>
      <li><strong>Smart Project Templates:</strong> Start with battle-tested templates that adapt to your specific needs</li>
      <li><strong>Real-time Collaboration:</strong> Work seamlessly with your team in real-time, with AI assistance for every team member</li>
      <li><strong>Integrated Deployment:</strong> Deploy your projects to multiple platforms with a single click</li>
      <li><strong>Performance Analytics:</strong> Get detailed insights into your project's performance and optimization opportunities</li>
    </ul>
    
    <p>Whether you're a solo developer working on a side project or part of a large development team, Perplexity Labs provides the tools and intelligence you need to turn ideas into reality faster than ever before.</p>
  `,
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop&crop=face',
    website: 'https://perplexity.ai',
    github: 'https://github.com/perplexity-labs',
    tags: ['Productivity', 'Artificial Intelligence', 'Search'],
    votes: 247,
    submittedBy: {
        id: 'user1',
        name: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b9c5?w=40&h=40&fit=crop&crop=face',
        role: 'Product Manager'
    },
    submittedAt: '2024-03-15T10:30:00Z'
})

const currentUser = ref < User > ({
    id: 'current-user',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    role: 'Developer'
})

const comments = ref < Comment[] > ([
    {
        id: 'comment1',
        text: 'This looks amazing! I\'ve been looking for something exactly like this. The AI-powered code generation feature could save me hours every week.',
        user: {
            id: 'user2',
            name: 'Alex Rodriguez',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
            role: 'Full Stack Developer'
        },
        createdAt: '2024-03-16T14:20:00Z',
        likes: 12,
        hasLiked: false
    },
    {
        id: 'comment2',
        text: 'Great concept! How does the AI handle complex architectural decisions? I\'d love to see a demo of the real-time collaboration features.',
        user: {
            id: 'user3',
            name: 'Maya Patel',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
            role: 'Senior Architect'
        },
        createdAt: '2024-03-16T16:45:00Z',
        likes: 8,
        hasLiked: true
    }
])

const relatedProducts = ref([
    {
        id: 'related1',
        company: 'DevTools Pro',
        description: 'Advanced development environment with AI assistance',
        logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=40&h=40&fit=crop&crop=center'
    },
    {
        id: 'related2',
        company: 'CodeCraft AI',
        description: 'AI-powered code review and optimization platform',
        logo: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=40&h=40&fit=crop&crop=center'
    }
])

const newComment = ref('')
const hasVoted = ref(false)

// Methods
const getTagIcon = (tag: string) => {
    const iconMap: Record<string, any> = {
        'Productivity': Zap,
        'Artificial Intelligence': Brain,
        'Search': Search,
        'Technology': Cpu,
        'Design': Palette,
        'Marketing': Megaphone
    }
    return iconMap[tag] || Tag
}

const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return 'today'
    if (diffInDays === 1) return 'yesterday'
    if (diffInDays < 30) return `${diffInDays} days ago`

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const handleVote = () => {
    if (!hasVoted.value) {
        product.value.votes++
        hasVoted.value = true
        // Here you would typically make an API call to record the vote
    }
}

const submitComment = () => {
    if (!newComment.value.trim()) return

    const comment: Comment = {
        id: `comment-${Date.now()}`,
        text: newComment.value.trim(),
        user: currentUser.value,
        createdAt: new Date().toISOString(),
        likes: 0,
        hasLiked: false
    }

    comments.value.unshift(comment)
    newComment.value = ''
}

const toggleCommentLike = (comment: Comment) => {
    if (comment.hasLiked) {
        comment.likes--
        comment.hasLiked = false
    } else {
        comment.likes++
        comment.hasLiked = true
    }
}
</script>