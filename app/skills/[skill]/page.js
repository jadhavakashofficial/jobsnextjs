import Link from 'next/link'

export default function SkillsOverviewPage() {
  const skillCategories = [
    {
      category: 'Frontend Development',
      icon: '🎨',
      color: 'primary',
      skills: [
        { slug: 'react', name: 'React.js', icon: '⚛️', jobs: '250+', level: 'High Demand' },
        { slug: 'javascript', name: 'JavaScript', icon: '🟨', jobs: '400+', level: 'Essential' },
        { slug: 'angular', name: 'Angular', icon: '🔺', jobs: '180+', level: 'Popular' },
        { slug: 'vue', name: 'Vue.js', icon: '💚', jobs: '120+', level: 'Growing' }
      ]
    },
    {
      category: 'Backend Development',
      icon: '⚙️',
      color: 'accent',
      skills: [
        { slug: 'python', name: 'Python', icon: '🐍', jobs: '300+', level: 'High Demand' },
        { slug: 'java', name: 'Java', icon: '☕', jobs: '350+', level: 'Enterprise' },
        { slug: 'nodejs', name: 'Node.js', icon: '🟢', jobs: '200+', level: 'Modern' },
        { slug: 'php', name: 'PHP', icon: '🐘', jobs: '150+', level: 'Stable' }
      ]
    },
    {
      category: 'Data & AI',
      icon: '🤖',
      color: 'success',
      skills: [
        { slug: 'machine-learning', name: 'Machine Learning', icon: '🤖', jobs: '180+', level: 'Hot' },
        { slug: 'data-science', name: 'Data Science', icon: '📊', jobs: '220+', level: 'Growing' },
        { slug: 'python', name: 'Python (Data)', icon: '🐍', jobs: '250+', level: 'Essential' }
      ]
    },
    {
      category: 'Database',
      icon: '🗄️',
      color: 'warning',
      skills: [
        { slug: 'mysql', name: 'MySQL', icon: '🗄️', jobs: '280+', level: 'Standard' },
        { slug: 'mongodb', name: 'MongoDB', icon: '🍃', jobs: '160+', level: 'NoSQL' }
      ]
    },
    {
      category: 'Cloud & DevOps',
      icon: '☁️',
      color: 'neutral',
      skills: [
        { slug: 'aws', name: 'AWS', icon: '☁️', jobs: '200+', level: 'High Pay' },
        { slug: 'docker', name: 'Docker', icon: '🐳', jobs: '150+', level: 'Modern' },
        { slug: 'kubernetes', name: 'Kubernetes', icon: '⚙️', jobs: '120+', level: 'Advanced' }
      ]
    },
    {
      category: 'Design & Marketing',
      icon: '🎯',
      color: 'error',
      skills: [
        { slug: 'ui-ux', name: 'UI/UX Design', icon: '🎨', jobs: '180+', level: 'Creative' },
        { slug: 'digital-marketing', name: 'Digital Marketing', icon: '📱', jobs: '250+', level: 'Growing' },
        { slug: 'seo', name: 'SEO', icon: '🔍', jobs: '140+', level: 'Essential' },
        { slug: 'content-writing', name: 'Content Writing', icon: '✍️', jobs: '160+', level: 'Versatile' }
      ]
    }
  ]

  const getLevelColor = (level) => {
    switch (level) {
      case 'Essential': case 'High Demand': return 'bg-success-100 text-success-700'
      case 'Hot': case 'Modern': return 'bg-warning-100 text-warning-700'
      case 'Growing': case 'Popular': return 'bg-primary-100 text-primary-700'
      case 'Enterprise': case 'Standard': return 'bg-accent-100 text-accent-700'
      default: return 'bg-neutral-100 text-neutral-700'
    }
  }

  const getColorClasses = (color) => {
    const colors = {
      primary: 'border-primary-200 hover:border-primary-300 hover:bg-primary-50',
      accent: 'border-accent-200 hover:border-accent-300 hover:bg-accent-50',
      success: 'border-success-200 hover:border-success-300 hover:bg-success-50',
      warning: 'border-warning-200 hover:border-warning-300 hover:bg-warning-50',
      error: 'border-error-200 hover:border-error-300 hover:bg-error-50',
      neutral: 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
    }
    return colors[color] || colors.neutral
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-accent bg-clip-text text-transparent">
          Jobs by Skills
        </h1>
        <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
          Discover opportunities based on your technical skills. From programming languages 
          to cutting-edge technologies, find your perfect match.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-accent-600 mb-2">20+</div>
          <p className="text-neutral-600">Skills</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">6</div>
          <p className="text-neutral-600">Categories</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-success-600 mb-2">3000+</div>
          <p className="text-neutral-600">Total Jobs</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-warning-600 mb-2">500+</div>
          <p className="text-neutral-600">Companies</p>
        </div>
      </div>

      {/* Skills by Category */}
      <div className="space-y-8 mb-12">
        {skillCategories.map((categoryData) => (
          <div key={categoryData.category} className="bg-white rounded-2xl p-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">{categoryData.icon}</div>
              <h2 className="text-2xl font-bold text-neutral-800">{categoryData.category}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {categoryData.skills.map((skill) => (
                <Link
                  key={skill.slug}
                  href={`/skills/${skill.slug}`}
                  className={`group bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-lg ${getColorClasses(categoryData.color)}`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {skill.icon}
                    </div>
                    <h3 className="font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors">
                      {skill.name}
                    </h3>
                    <div className="flex flex-col gap-2">
                      <span className="text-lg font-semibold text-success-600">
                        {skill.jobs} Jobs
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelColor(skill.level)}`}>
                        {skill.level}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Trending Skills */}
      <div className="bg-gradient-primary text-white rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">🔥 Trending Skills This Month</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'React.js', growth: '+25%' },
            { name: 'Python', growth: '+20%' },
            { name: 'Machine Learning', growth: '+30%' },
            { name: 'AWS', growth: '+18%' }
          ].map((trend) => (
            <div key={trend.name} className="text-center">
              <div className="text-lg font-semibold">{trend.name}</div>
              <div className="text-sm opacity-90">{trend.growth} growth</div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Combinations */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Popular Skill Combinations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">Full Stack Development</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">React</span>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">Node.js</span>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">MongoDB</span>
            </div>
          </div>
          
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">Data Science</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">Python</span>
              <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">Machine Learning</span>
              <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">SQL</span>
            </div>
          </div>
          
          <div className="p-4 bg-neutral-50 rounded-lg">
            <h3 className="font-semibold mb-2">DevOps Engineer</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">AWS</span>
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Docker</span>
              <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded">Kubernetes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Resources */}
      <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">🎓 Skill Up with Free Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl mb-4">📚</div>
            <h3 className="font-semibold mb-2">Free Courses</h3>
            <p className="text-sm text-neutral-600">Learn from top platforms like Coursera, edX, and YouTube</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">💻</div>
            <h3 className="font-semibold mb-2">Practice Projects</h3>
            <p className="text-sm text-neutral-600">Build real-world projects to showcase your skills</p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-semibold mb-2">Certifications</h3>
            <p className="text-sm text-neutral-600">Get certified from Google, Microsoft, AWS, and more</p>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-2xl p-8 shadow-md">
        <h2 className="text-2xl font-bold mb-4">Master In-Demand Skills for Your Tech Career</h2>
        <div className="prose prose-neutral max-w-none">
          <p className="text-neutral-600 mb-4">
            The technology landscape is constantly evolving, and staying current with in-demand skills 
            is crucial for career success. Whether you're a fresher starting your journey or an 
            experienced professional looking to upskill, understanding market demands helps you 
            make informed career decisions.
          </p>
          
          <h3 className="text-lg font-semibold mb-3">How to Choose the Right Skills:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600 mb-6">
            <div>
              <strong>• Market Demand:</strong> Focus on skills with high job availability
            </div>
            <div>
              <strong>• Growth Potential:</strong> Choose technologies with upward trends
            </div>
            <div>
              <strong>• Salary Impact:</strong> Some skills command premium salaries
            </div>
            <div>
              <strong>• Learning Curve:</strong> Consider time investment vs. returns
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3">Skills by Experience Level:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-neutral-600">
            <div>
              <strong>Freshers:</strong> HTML, CSS, JavaScript, Python basics
            </div>
            <div>
              <strong>Intermediate:</strong> React, Node.js, databases, cloud basics
            </div>
            <div>
              <strong>Advanced:</strong> System design, DevOps, machine learning
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}