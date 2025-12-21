/**
 * Room Coverage Admin Page
 * 
 * Displays diagnostic information about room registry coverage
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Search, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { 
  getRoomCoverageReport, 
  type RoomCoverageReport,
  validateRoomInRegistry 
} from '@/lib/rooms/roomRegistryDiagnostics';
import { debugSearch, getSearchCoverageStats } from '@/lib/search/searchDiagnostics';
import { getAllRooms } from '@/lib/rooms/roomRegistry';

export default function RoomCoverage() {
  const [report, setReport] = useState<RoomCoverageReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    refreshReport();
  }, []);
  
  const refreshReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newReport = getRoomCoverageReport();
      setReport(newReport);
      setIsLoading(false);
    }, 100);
  };
  
  const handleSearchTest = () => {
    if (!searchQuery.trim()) return;
    const result = debugSearch(searchQuery, 10);
    setSearchResults(result);
  };
  
  const stats = getSearchCoverageStats();
  
  if (!report) {
    return <div className="p-8">Loading coverage report...</div>;
  }
  
  const filteredMissing = selectedTier === 'all' 
    ? report.missingFromRegistry
    : report.missingFromRegistry.filter(m => m.id.includes(selectedTier));
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Database className="h-6 w-6" />
              Room Coverage Diagnostics
            </h1>
            <p className="text-muted-foreground mt-1">
              Registry coverage and search validation
            </p>
          </div>
          <Button 
            onClick={refreshReport} 
            variant="outline"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{report.totalRegistryRooms}</div>
              <div className="text-sm text-muted-foreground">Registry Rooms</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{report.totalManifestEntries}</div>
              <div className="text-sm text-muted-foreground">Manifest Entries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">{report.totalDataMapEntries}</div>
              <div className="text-sm text-muted-foreground">DataMap Entries</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className={`text-2xl font-bold ${report.healthScore >= 90 ? 'text-green-600' : report.healthScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                {report.healthScore}%
              </div>
              <div className="text-sm text-muted-foreground">Health Score</div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="coverage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="tiers">By Tier</TabsTrigger>
            <TabsTrigger value="missing">Missing Rooms</TabsTrigger>
            <TabsTrigger value="search">Search Test</TabsTrigger>
          </TabsList>
          
          {/* Coverage Tab */}
          <TabsContent value="coverage">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Registry Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Rooms with titles</span>
                    <Badge variant="outline">{stats.roomsWithTitles}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rooms with keywords</span>
                    <Badge variant="outline">{stats.roomsWithKeywords}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Rooms with tags</span>
                    <Badge variant="outline">{stats.roomsWithTags}</Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">By Domain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {Object.entries(stats.byDomain).map(([domain, count]) => (
                    <div key={domain} className="flex justify-between">
                      <span className="capitalize">{domain}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* By Tier Tab */}
          <TabsContent value="tiers">
            <Card>
              <CardHeader>
                <CardTitle>Coverage by Tier</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Tier</th>
                        <th className="text-right py-2">Manifest</th>
                        <th className="text-right py-2">Registry</th>
                        <th className="text-right py-2">DataMap</th>
                        <th className="text-right py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.byTier.map(tier => (
                        <tr key={tier.tier} className="border-b">
                          <td className="py-2 font-medium">{tier.tier}</td>
                          <td className="text-right">{tier.manifestCount}</td>
                          <td className="text-right">{tier.registryCount}</td>
                          <td className="text-right">{tier.dataMapCount}</td>
                          <td className="text-right">
                            {tier.difference === 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-600 inline" />
                            ) : (
                              <span className="text-yellow-600">
                                <AlertTriangle className="h-4 w-4 inline mr-1" />
                                Δ{tier.difference}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Missing Rooms Tab */}
          <TabsContent value="missing">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Missing Rooms ({report.missingFromRegistry.length})</CardTitle>
                  <select 
                    className="border rounded px-2 py-1 text-sm"
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                  >
                    <option value="all">All Tiers</option>
                    <option value="free">Free</option>
                    <option value="vip1">VIP1</option>
                    <option value="vip2">VIP2</option>
                    <option value="vip3">VIP3</option>
                    <option value="vip4">VIP4</option>
                    <option value="vip5">VIP5</option>
                    <option value="vip6">VIP6</option>
                    <option value="vip9">VIP9</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMissing.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-2" />
                    No missing rooms detected
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredMissing.map((room, idx) => (
                      <div 
                        key={`${room.id}-${idx}`}
                        className="flex items-center justify-between p-2 bg-muted/50 rounded"
                      >
                        <div>
                          <div className="font-mono text-sm">{room.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {room.reason}
                          </div>
                        </div>
                        <Badge variant="outline">{room.source}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Search Test Tab */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Search Debugger</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search query (e.g., ADHD, Anxiety, Writing)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchTest()}
                  />
                  <Button onClick={handleSearchTest}>
                    <Search className="h-4 w-4 mr-2" />
                    Test
                  </Button>
                </div>
                
                {searchResults && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-2 bg-muted rounded">
                        <div className="text-2xl font-bold">{searchResults.totalRoomsInRegistry}</div>
                        <div className="text-xs text-muted-foreground">Registry Size</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-2xl font-bold">{searchResults.matchCount}</div>
                        <div className="text-xs text-muted-foreground">Matches</div>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <div className="text-2xl font-bold">{searchResults.searchTime.toFixed(1)}ms</div>
                        <div className="text-xs text-muted-foreground">Time</div>
                      </div>
                    </div>
                    
                    <div className="border rounded">
                      <div className="font-medium p-2 border-b bg-muted">Top Results</div>
                      <div className="divide-y">
                        {searchResults.topResults.length === 0 ? (
                          <div className="p-4 text-center text-muted-foreground">
                            No results found
                          </div>
                        ) : (
                          searchResults.topResults.map((r: any, i: number) => (
                            <div key={r.id} className="p-2 flex items-center justify-between">
                              <div>
                                <span className="text-muted-foreground mr-2">{i + 1}.</span>
                                <span className="font-medium">{r.title_en}</span>
                                <span className="text-xs text-muted-foreground ml-2">({r.id})</span>
                              </div>
                              <div className="flex gap-2">
                                <Badge variant="secondary">{r.tier}</Badge>
                                <Badge variant="outline">score: {r.score}</Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Timestamp */}
        <div className="text-xs text-muted-foreground text-center">
          Report generated: {report.timestamp}
        </div>
      </div>
    </div>
  );
}
