<template>
    <div class="product-card">
        <div class="card-content">
            <!-- Ranking -->
            <div class="ranking">
                {{ ranking }}.
            </div>

            <!-- Company Info -->
            <div class="company-section">
                <div class="company-header">
                    <img :src="logo" :alt="`${company} logo`" class="company-logo" />
                    <div class="company-info">
                        <h3 class="company-name">
                            {{ company }}
                            <Icon name="lucide:external-link" class="external-icon" />
                        </h3>
                        <p class="company-description">{{ description }}</p>
                    </div>
                </div>

                <!-- Tags -->
                <div class="tags-container">
                    <span v-for="tag in tags" :key="tag" class="tag">
                        <Icon :name="getTagIcon(tag)" class="tag-icon" />
                        {{ tag }}
                    </span>
                </div>
            </div>

            <!-- Stats -->
            <div class="stats">
                <div class="stat-item">
                    <Icon name="lucide:heart" class="stat-icon" />
                    <span class="stat-value">{{ likes }}</span>
                </div>
                <div class="stat-item">
                    <Icon name="lucide:message-circle" class="stat-icon" />
                    <span class="stat-value">{{ comments }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Props {
    ranking: number
    company: string
    logo: string
    description: string
    tags: string[]
    likes: number
    comments: number
}

const props = withDefaults(defineProps<Props>(), {
    ranking: 1,
    company: 'Perplexity Labs',
    logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=64&h=64&fit=crop&crop=face',
    description: 'Bring your projects to life faster than ever before',
    tags: () => ['Productivity', 'Artificial Intelligence', 'Search'],
    likes: 2,
    comments: 353
})

const getTagIcon = (tag: string): string => {
    const iconMap: Record<string, string> = {
        'Productivity': 'lucide:zap',
        'Artificial Intelligence': 'lucide:brain',
        'Search': 'lucide:search',
        'Technology': 'lucide:cpu',
        'Design': 'lucide:palette',
        'Marketing': 'lucide:megaphone'
    }
    return iconMap[tag] || 'lucide:tag'
}
</script>

<style scoped>
.product-card {
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin: 8px 0;
    transition: all 0.2s ease;
    max-width: full;
    margin: 2%;
}

.product-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
}

.ranking {
    font-size: 18px;
    font-weight: 600;
    color: #374151;
    min-width: 24px;
    margin-top: 2px;
}

.company-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.company-header {
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.company-logo {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    object-fit: cover;
    flex-shrink: 0;
}

.company-info {
    flex: 1;
}

.company-name {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0 0 4px 0;
}

.external-icon {
    width: 14px;
    height: 14px;
    color: #6b7280;
}

.company-description {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
    line-height: 1.4;
}

.tags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.tag {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f3f4f6;
    color: #374151;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
}

.tag-icon {
    width: 12px;
    height: 12px;
}

.stats {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: center;
    margin-left: auto;
}

.stat-item {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #6b7280;
    font-size: 14px;
}

.stat-icon {
    width: 16px;
    height: 16px;
}

.stat-value {
    font-weight: 500;
}

@media (max-width: 640px) {
    .card-content {
        flex-direction: column;
        gap: 12px;
    }

    .stats {
        flex-direction: row;
        justify-content: flex-start;
        margin-left: 0;
    }

    .ranking {
        align-self: flex-start;
    }
}
</style>