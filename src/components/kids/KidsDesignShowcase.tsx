import { Card } from '@/components/ui/card';
import { KIDS_COLORS, KIDS_ANIMATIONS, getKidsMascot, getProgressBadge } from '@/lib/kidsDesignSystem';

export const KidsDesignShowcase = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Kids English Design System</h2>
        <p className="text-muted-foreground">Rainbow theme with age-appropriate visuals</p>
      </div>

      {/* Color Palette */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Color Palette</h3>
        
        {/* Level Colors */}
        {Object.entries(KIDS_COLORS).slice(0, 3).map(([level, colors]) => (
          <Card key={level} className="p-6">
            <h4 className="text-lg font-medium mb-4 capitalize">
              {level === 'level1' ? 'Level 1: Ages 4-7 (Pink Theme)' :
               level === 'level2' ? 'Level 2: Ages 7-10 (Green Theme)' :
               'Level 3: Ages 10-13 (Orange Theme)'}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div
                  className="w-full h-20 rounded-lg border-2 border-border mb-2"
                  style={{ backgroundColor: colors.primary }}
                />
                <p className="text-xs font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">{colors.primary}</p>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-20 rounded-lg border-2 border-border mb-2"
                  style={{ backgroundColor: colors.secondary }}
                />
                <p className="text-xs font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">{colors.secondary}</p>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-20 rounded-lg border-2 border-border mb-2"
                  style={{ backgroundColor: colors.accent }}
                />
                <p className="text-xs font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">{colors.accent}</p>
              </div>
              <div className="text-center">
                <div
                  className="w-full h-20 rounded-lg border-2 border-border mb-2"
                  style={{ backgroundColor: colors.background }}
                />
                <p className="text-xs font-medium">Background</p>
                <p className="text-xs text-muted-foreground">{colors.background}</p>
              </div>
              <div className="text-center">
                <div
                  className={`w-full h-20 rounded-lg border-2 border-border mb-2 bg-gradient-to-r ${colors.gradient}`}
                />
                <p className="text-xs font-medium">Gradient</p>
              </div>
            </div>
          </Card>
        ))}

        {/* Rainbow Colors */}
        <Card className="p-6">
          <h4 className="text-lg font-medium mb-4">Rainbow Accents</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {Object.entries(KIDS_COLORS.rainbow).map(([name, color]) => (
              <div key={name} className="text-center">
                <div
                  className="w-full h-20 rounded-lg border-2 border-border mb-2"
                  style={{ backgroundColor: color }}
                />
                <p className="text-xs font-medium capitalize">{name}</p>
                <p className="text-xs text-muted-foreground">{color}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Animations */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Animations</h3>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl animate-wiggle">⭐</div>
              <p className="text-sm font-medium">Wiggle</p>
              <code className="text-xs text-muted-foreground">animate-wiggle</code>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl animate-float">🎈</div>
              <p className="text-sm font-medium">Float</p>
              <code className="text-xs text-muted-foreground">animate-float</code>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl animate-bounce">🏀</div>
              <p className="text-sm font-medium">Bounce</p>
              <code className="text-xs text-muted-foreground">animate-bounce</code>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl animate-pulse">💫</div>
              <p className="text-sm font-medium">Pulse</p>
              <code className="text-xs text-muted-foreground">animate-pulse</code>
            </div>
          </div>
        </Card>
      </section>

      {/* Mascots */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Mascots</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['4-7', '7-10', '10-13'].map((ageRange) => {
            const mascot = getKidsMascot(ageRange);
            return (
              <Card key={ageRange} className="p-6 text-center space-y-3">
                <div className="text-6xl animate-wiggle">{mascot.emoji}</div>
                <div>
                  <p className="font-semibold text-lg">{mascot.name}</p>
                  <p className="text-sm text-muted-foreground">Ages {ageRange}</p>
                </div>
                <p className="text-sm">{mascot.description}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Progress Badges */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Progress Badges</h3>
        <Card className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[0, 2, 4, 5].map((completed) => {
              const badge = getProgressBadge(completed, 5);
              return (
                <div key={completed} className="text-center space-y-2">
                  <div className="text-5xl" style={{ color: badge.color }}>
                    {badge.emoji}
                  </div>
                  <div>
                    <p className="font-medium capitalize">{badge.level}</p>
                    <p className="text-xs text-muted-foreground">
                      {completed}/5 entries
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Typography Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Ages 4-7</p>
            <p className="text-2xl font-bold" style={{ fontFamily: 'Comic Neue, Nunito, sans-serif' }}>
              Fun & Playful
            </p>
            <p className="text-sm" style={{ fontFamily: 'Comic Neue, Nunito, sans-serif' }}>
              Large, friendly text for early readers
            </p>
          </Card>
          <Card className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Ages 7-10</p>
            <p className="text-xl font-semibold" style={{ fontFamily: 'Quicksand, Poppins, sans-serif' }}>
              Balanced & Clear
            </p>
            <p className="text-sm" style={{ fontFamily: 'Quicksand, Poppins, sans-serif' }}>
              Readable text for developing skills
            </p>
          </Card>
          <Card className="p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Ages 10-13</p>
            <p className="text-lg font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Professional & Educational
            </p>
            <p className="text-sm" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Standard text for confident readers
            </p>
          </Card>
        </div>
      </section>

      {/* Design Principles */}
      <section className="space-y-4">
        <h3 className="text-2xl font-semibold text-foreground">Design Principles</h3>
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xl">🌈</span>
                <div>
                  <p className="font-medium">Rainbow Theme</p>
                  <p className="text-sm text-muted-foreground">Bright, vibrant colors throughout</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🌟</span>
                <div>
                  <p className="font-medium">Age-Appropriate</p>
                  <p className="text-sm text-muted-foreground">Designs match developmental stages</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🌍</span>
                <div>
                  <p className="font-medium">Culturally Neutral</p>
                  <p className="text-sm text-muted-foreground">Inclusive, universal designs</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xl">📚</span>
                <div>
                  <p className="font-medium">Educational Focus</p>
                  <p className="text-sm text-muted-foreground">Supports learning objectives</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">😊</span>
                <div>
                  <p className="font-medium">Safe & Friendly</p>
                  <p className="text-sm text-muted-foreground">No scary or sensitive content</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🎨</span>
                <div>
                  <p className="font-medium">Playful Design</p>
                  <p className="text-sm text-muted-foreground">Fun, engaging, curiosity-driven</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};