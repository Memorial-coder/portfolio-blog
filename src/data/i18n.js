export const translations = {
    en: {
        nav: {
            home: 'home',
            skills: 'skills',
            projects: 'projects',
            contacts: 'contacts',
            blog: 'Tech Notes',
            languageToggle: '中文'
        },
        common: {
            loading: 'LOADING',
            backToHome: 'Back to Home',
            liveDemo: 'Live Demo',
            sourceCode: 'Source Code',
            fullDetails: 'Full Details'
        },
        home: {
            introPrefix: 'MY NAME IS',
            introPhrases: ['MY NAME IS', 'Welcome to\nmy blog'],
            cta: 'View GitHub',
            dragHint: 'Drag to explore featured projects.',
            cardLabels: {
                role: 'Role',
                focus: 'Focus',
                project: 'Project'
            }
        },
        skills: {
            title: 'My Skills',
            description: 'I focus on frontend architecture, product details, and web experiences that stay maintainable as they grow.'
        },
        projects: {
            title: 'My Projects',
            description: 'Selected work and experiments. Click a project to view more details.',
            mission: 'Mission',
            languages: 'Languages'
        },
        projectDetail: {
            notFound: 'Project not found',
            overview: 'Overview',
            technologies: 'Technologies',
            relatedPost: 'Related Post'
        },
        modal: {
            role: 'Role'
        },
        contacts: {
            title: 'Get In Touch',
            description: 'For project feedback, collaboration, or technical discussion, GitHub is the best place to reach me.',
            infoTitle: 'Contact Information',
            infoBody: 'This site keeps personal contact details minimal. Use GitHub for public project discussions.',
            github: 'GitHub',
            featuredProject: 'Featured Project',
            location: 'Location',
            yourName: 'Your Name',
            yourEmail: 'Your Email',
            message: 'Message',
            namePlaceholder: 'Your name',
            emailPlaceholder: 'you@example.com',
            messagePlaceholder: 'What would you like to discuss?',
            send: 'Send Message',
            sending: 'Sending...',
            errors: {
                name: 'Name must be at least 2 characters.',
                email: 'Please enter a valid email address.',
                message: 'Message must be at least 10 characters.'
            },
            toast: {
                missingEmail: 'Email is not configured yet. Please reach me through GitHub.',
                success: 'Message sent successfully!',
                configError: 'Config Error: Reconnect Gmail in EmailJS Dashboard.',
                failed: 'Failed to send message. Please try again.'
            },
            partners: {
                eyebrow: 'Partners',
                title: 'Collaboration Network',
                description: 'People and groups connected to project feedback, implementation, deployment, and public maintenance.',
                items: [
                    {
                        title: 'Open Source Partners',
                        subtitle: 'Public repositories, review, and shared project work'
                    },
                    {
                        title: 'Frontend Collaborators',
                        subtitle: 'React interfaces, motion details, and component polish'
                    },
                    {
                        title: 'Game Systems Team',
                        subtitle: 'Game-like web flows, data loops, and interaction design'
                    },
                    {
                        title: 'Tooling Partners',
                        subtitle: 'Build pipelines, deployment checks, and automation support'
                    },
                    {
                        title: 'Design Review Circle',
                        subtitle: 'UX critique, visual direction, and product feedback'
                    },
                    {
                        title: 'Community Builders',
                        subtitle: 'Docs, discussions, and long-term maintenance support'
                    }
                ]
            }
        },
        blog: {
            title: 'Tech Notes',
            description: 'Project notes, build logs, and frontend decisions by Portfolio Owner.',
            readMore: 'Read Article',
            writeBlog: 'Write Blog',
            searchPlaceholder: 'Search posts by title, tag, or excerpt',
            filterLabel: 'Search and filter posts',
            allTags: 'All tags',
            noResults: 'No posts match the current filters.',
            clearFilters: 'Clear filters',
            deletePost: 'Delete',
            deleteConfirm: 'Delete this post? This cannot be undone.',
            deleted: 'Post deleted.',
            deleteFailed: 'Failed to delete post. Please sign in again and retry.',
            posts: [
                {
                    id: 1,
                    title: 'Featured Project Project Notes',
                    excerpt: 'Notes on shaping Featured Project, an independently deployable Chinese pastoral management experience with online systems.',
                    date: 'May 28, 2026',
                    readTime: '4 min read',
                    tags: ['TypeScript', 'Vue', 'Game'],
                    slug: 'monochrome-portfolio'
                },
                {
                    id: 2,
                    title: 'Why This Blog Uses a Monochrome System',
                    excerpt: 'A short design note about keeping the portfolio quiet, readable, and focused on work instead of decoration.',
                    date: 'May 28, 2026',
                    readTime: '3 min read',
                    tags: ['React', 'Design', 'CSS'],
                    slug: 'typescript-journey'
                },
                {
                    id: 3,
                    title: 'Technical Stack Inventory',
                    excerpt: 'A lightweight inventory of the public project stack: TypeScript, Vue, JavaScript, Python, Java, CSS, and Docker.',
                    date: 'May 28, 2026',
                    readTime: '3 min read',
                    tags: ['Architecture', 'Stack'],
                    slug: 'css-grid-flexbox'
                }
            ]
        },
        blogPost: {
            back: 'Back to Tech Notes',
            notFound: '# 404: Post Not Found\nSorry, that article could not be located.'
        },
        footer: {
            explore: 'Explore',
            connect: 'Connect',
            uses: 'Uses',
            projects: 'Projects',
            contact: 'Contact',
            admin: 'Admin',
            rights: 'All rights reserved.'
        },
        uses: {
            title: 'Uses',
            description: 'A curated list of the tech, hardware, and software I use daily.',
            categories: {
                hardware: {
                    title: 'Hardware',
                    items: [
                        ['Laptop', 'Windows workstation / development machine'],
                        ['Monitor', 'External display for coding and testing'],
                        ['Mouse', 'Precision mouse for daily work'],
                        ['Headphones', 'Noise-controlled focus setup']
                    ]
                },
                peripherals: {
                    title: 'Peripherals',
                    items: [
                        ['Keyboard', 'Mechanical keyboard'],
                        ['Webcam', 'HD webcam'],
                        ['Desk', 'Clean desk setup for long sessions']
                    ]
                },
                software: {
                    title: 'Software',
                    items: [
                        ['Editor', 'VS Code / JetBrains IDEs'],
                        ['Terminal', 'PowerShell and Git tools'],
                        ['Browser', 'Chrome / Edge for debugging'],
                        ['Productivity', 'GitHub, Figma, Markdown notes']
                    ]
                }
            }
        },
        notFound: {
            title: 'Page Not Found',
            description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
            cta: 'Back to Home'
        }
    },
    zh: {
        nav: {
            home: '首页',
            skills: '技能',
            projects: '项目',
            contacts: '联系',
            blog: '技术笔记',
            languageToggle: 'EN'
        },
        common: {
            loading: '加载中',
            backToHome: '返回首页',
            liveDemo: '在线体验',
            sourceCode: '源码',
            fullDetails: '查看详情'
        },
        home: {
            introPrefix: '我的名字是',
            introPhrases: ['我的名字是', '欢迎来到\n我的博客'],
            cta: '查看 GitHub',
            dragHint: '按住滑动查看首屏项目',
            cardLabels: {
                role: '角色',
                focus: '方向',
                project: '项目'
            }
        },
        skills: {
            title: '我的技能',
            description: '我关注前端架构、产品细节，以及能长期维护和迭代的 Web 体验。'
        },
        projects: {
            title: '我的项目',
            description: '这里是一些已公开的项目与实验。点击项目可以查看更详细的信息。',
            mission: '职责',
            languages: '技术栈'
        },
        projectDetail: {
            notFound: '未找到项目',
            overview: '概览',
            technologies: '技术栈',
            relatedPost: '相关帖子'
        },
        modal: {
            role: '职责'
        },
        contacts: {
            title: '联系我',
            description: '如果你想反馈项目、讨论合作或交流技术，GitHub 是最合适的联系入口。',
            infoTitle: '联系信息',
            infoBody: '这个站点尽量少展示私人联系方式。公开项目讨论建议通过 GitHub 进行。',
            github: 'GitHub',
            featuredProject: '代表项目',
            location: '所在地',
            yourName: '你的名字',
            yourEmail: '你的邮箱',
            message: '留言',
            namePlaceholder: '你的名字',
            emailPlaceholder: 'you@example.com',
            messagePlaceholder: '你想讨论什么？',
            send: '发送消息',
            sending: '发送中...',
            errors: {
                name: '名字至少需要 2 个字符。',
                email: '请输入有效的邮箱地址。',
                message: '留言至少需要 10 个字符。'
            },
            toast: {
                missingEmail: '邮件服务还没有配置，请先通过 GitHub 联系我。',
                success: '消息已发送。',
                configError: 'EmailJS 配置错误，请重新连接 Gmail。',
                failed: '发送失败，请稍后再试。'
            },
            partners: {
                eyebrow: '合作方',
                title: '协作网络',
                description: '这些是围绕项目反馈、实现、部署和公开维护建立联系的人与团队。',
                items: [
                    {
                        title: '开源伙伴',
                        subtitle: '公开仓库、代码审查和共享项目协作'
                    },
                    {
                        title: '前端协作者',
                        subtitle: 'React 界面、动效细节和组件打磨'
                    },
                    {
                        title: '游戏系统团队',
                        subtitle: '游戏化 Web 流程、数据循环和交互设计'
                    },
                    {
                        title: '工具链伙伴',
                        subtitle: '构建流水线、部署检查和自动化支持'
                    },
                    {
                        title: '设计评审小组',
                        subtitle: 'UX 评审、视觉方向和产品反馈'
                    },
                    {
                        title: '社区维护者',
                        subtitle: '文档、讨论和长期维护支持'
                    }
                ]
            }
        },
        blog: {
            title: '技术笔记',
            description: 'Portfolio Owner 的项目记录、构建日志和前端决策。',
            readMore: '阅读文章',
            writeBlog: '写博客',
            searchPlaceholder: '按标题、标签或摘要搜索文章',
            filterLabel: '搜索和筛选文章',
            allTags: '全部标签',
            noResults: '没有符合当前筛选条件的文章。',
            clearFilters: '清除筛选',
            deletePost: '删除',
            deleteConfirm: '确定删除这篇文章吗？此操作无法撤销。',
            deleted: '文章已删除。',
            deleteFailed: '文章删除失败，请重新登录后再试。',
            posts: [
                {
                    id: 1,
                    title: 'Featured Project：项目笔记',
                    excerpt: '记录一个可独立部署的国风田园经营项目，以及账号、云存档、交流大厅等在线能力的设计。',
                    date: '2026 年 5 月 28 日',
                    readTime: '约 4 分钟',
                    tags: ['TypeScript', 'Vue', '游戏化'],
                    slug: 'monochrome-portfolio'
                },
                {
                    id: 2,
                    title: '为什么这个博客采用黑白系统',
                    excerpt: '关于保持作品集安静、清晰，并把注意力留给项目和文字的一点设计说明。',
                    date: '2026 年 5 月 28 日',
                    readTime: '约 3 分钟',
                    tags: ['React', '设计', 'CSS'],
                    slug: 'typescript-journey'
                },
                {
                    id: 3,
                    title: '技术栈清单',
                    excerpt: '轻量记录公开项目里的 TypeScript、Vue、JavaScript、Python、Java、CSS 和 Docker。',
                    date: '2026 年 5 月 28 日',
                    readTime: '约 3 分钟',
                    tags: ['架构', '技术栈'],
                    slug: 'css-grid-flexbox'
                }
            ]
        },
        blogPost: {
            back: '返回技术笔记',
            notFound: '# 404：未找到文章\n抱歉，没有找到这篇文章。'
        },
        footer: {
            explore: '浏览',
            connect: '连接',
            uses: '工具',
            projects: '项目',
            contact: '联系',
            admin: '后台',
            rights: '版权所有。'
        },
        uses: {
            title: '工具',
            description: '我日常使用的技术、硬件和软件清单。',
            categories: {
                hardware: {
                    title: '硬件',
                    items: [
                        ['电脑', 'Windows 工作站 / 开发设备'],
                        ['显示器', '用于编码和测试的外接显示器'],
                        ['鼠标', '日常开发使用的精准鼠标'],
                        ['耳机', '用于专注工作的降噪环境']
                    ]
                },
                peripherals: {
                    title: '外设',
                    items: [
                        ['键盘', '机械键盘'],
                        ['摄像头', '高清摄像头'],
                        ['桌面', '适合长时间工作的简洁桌面']
                    ]
                },
                software: {
                    title: '软件',
                    items: [
                        ['编辑器', 'VS Code / JetBrains IDE'],
                        ['终端', 'PowerShell 和 Git 工具'],
                        ['浏览器', '用于调试的 Chrome / Edge'],
                        ['效率工具', 'GitHub、Figma、Markdown 笔记']
                    ]
                }
            }
        },
        notFound: {
            title: '页面不存在',
            description: '你访问的页面可能已被删除、改名，或暂时无法访问。',
            cta: '返回首页'
        }
    }
};

export const getCopy = (language) => translations[language] || translations.en;
