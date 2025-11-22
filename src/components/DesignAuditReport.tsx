import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export const DesignAuditReport = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Design Audit Report</h1>
        <p className="text-muted-foreground">Review design issues across the platform</p>
      </div>

      {/* Color Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Color & Contrast Issues
          </CardTitle>
          <CardDescription>Potential color problems that need review</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Essay Text Highlighting</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Current: Uses COLORS array in wordColorHighlighter.tsx with dark colors at full opacity
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Some colors may be too bold/bright on white background</li>
              <li>Contrast issues in dark mode not verified</li>
              <li>Vietnamese vs English highlighting uses same colors</li>
            </ul>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">Kids Rainbow Theme</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Current: Rainbow gradients on card borders and buttons
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Rainbow animation may be too distracting</li>
              <li>Need to verify readability for weak-sighted users with zoom</li>
              <li>Color combinations need accessibility check</li>
            </ul>
          </div>

          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold mb-2">VIP6 Theme (Past Issue)</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Previous setup had strange color choices
            </p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>VIP6 colors need consistency check with other VIP tiers</li>
              <li>Gradient usage should match design system</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Spacing Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Spacing & Layout Issues
          </CardTitle>
          <CardDescription>Spacing and positioning problems</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Button Positioning</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Zoom control fixed at bottom-right may overlap with other floating elements</li>
              <li>Admin floating button position needs coordination with zoom control</li>
              <li>Refresh buttons on Kids pages positioning needs review</li>
            </ul>
          </div>

          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold mb-2">Card/Box Layout</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Kids room cards spacing with rainbow borders</li>
              <li>Content card padding consistency across pages</li>
              <li>PairedHighlightedContent component spacing (mb-3, my-3)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Components to Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Components Requiring Review
          </CardTitle>
          <CardDescription>Files that need manual inspection</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="font-mono bg-muted p-2 rounded">
              src/lib/wordColorHighlighter.tsx
              <p className="text-xs text-muted-foreground mt-1">Color palette and highlighting logic</p>
            </div>
            <div className="font-mono bg-muted p-2 rounded">
              src/components/PairedHighlightedContent.tsx
              <p className="text-xs text-muted-foreground mt-1">Essay display spacing</p>
            </div>
            <div className="font-mono bg-muted p-2 rounded">
              src/pages/KidsLevel*.tsx
              <p className="text-xs text-muted-foreground mt-1">Rainbow theme implementation</p>
            </div>
            <div className="font-mono bg-muted p-2 rounded">
              src/components/ZoomControl.tsx
              <p className="text-xs text-muted-foreground mt-1">Fixed positioning and accessibility</p>
            </div>
            <div className="font-mono bg-muted p-2 rounded">
              src/index.css (VIP theme variables)
              <p className="text-xs text-muted-foreground mt-1">VIP tier color definitions</p>
            </div>
            <div className="font-mono bg-muted p-2 rounded">
              tailwind.config.ts (kids.rainbow colors)
              <p className="text-xs text-muted-foreground mt-1">Rainbow theme color palette</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2 list-decimal list-inside">
            <li className="text-sm">Test all pages with zoom at 150-200% for weak-sighted users</li>
            <li className="text-sm">Verify color contrast ratios meet WCAG AA standards</li>
            <li className="text-sm">Check essay highlighting readability in both light/dark mode</li>
            <li className="text-sm">Review rainbow animation performance on slower devices</li>
            <li className="text-sm">Ensure floating buttons don't overlap on mobile</li>
            <li className="text-sm">Standardize spacing scale across all pages</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
