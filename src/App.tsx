/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Tv, 
  Cpu, 
  Layers, 
  ArrowLeft, 
  ExternalLink, 
  Info, 
  History, 
  TrendingUp,
  Image as ImageIcon,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { searchPanelComponents, PanelInfo } from '@/src/lib/gemini';

const BRANDS = [
  { name: 'BOE', color: 'bg-blue-600' },
  { name: 'CSOT', color: 'bg-red-600' },
  { name: 'HKC', color: 'bg-indigo-600' },
  { name: 'Innolux', color: 'bg-green-600' },
  { name: 'AUO', color: 'bg-orange-600' }
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PanelInfo[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(['BOE HV550QUB', 'CSOT ST5461', 'HKC PT500GT']);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setIsOverlayOpen(false);
    setSearchQuery(query);
    setExpandedIndex(null);
    
    // Add to recent
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }

    const results = await searchPanelComponents(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 pb-20">
      {/* Status Bar Mockup */}
      <div className="h-6 bg-zinc-100 flex items-center justify-between px-4 text-[10px] font-medium text-zinc-500">
        <span>PanelHub AI</span>
        <div className="flex gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>

      {/* Main Header / Search Bar */}
      <header className="px-4 pt-6 pb-4 bg-white border-b border-zinc-200 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-600" />
            PanelHub
          </h1>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Info className="w-5 h-5 text-zinc-400" />
          </Button>
        </div>
        
        <div 
          onClick={() => setIsOverlayOpen(true)}
          className="relative flex items-center bg-zinc-100 rounded-2xl p-3 cursor-text hover:bg-zinc-200 transition-colors"
        >
          <Search className="w-5 h-5 text-zinc-500 ml-1" />
          <span className="ml-3 text-zinc-400">Search T-CON, Panel model...</span>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!searchResults.length && !isSearching ? (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-8"
            >
              {/* Brands Horizontal Scroll */}
              <section>
                <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 px-1">Top Chinese Manufacturers</h2>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex w-max space-x-3 pb-2">
                    {BRANDS.map((brand) => (
                      <button
                        key={brand.name}
                        onClick={() => handleSearch(brand.name + " latest panels")}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className={`w-16 h-16 ${brand.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                          {brand.name[0]}
                        </div>
                        <span className="text-xs font-medium text-zinc-600">{brand.name}</span>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </section>

              {/* Quick Categories */}
              <section className="grid grid-cols-2 gap-4">
                <Card className="rounded-3xl border-none bg-blue-50 shadow-none hover:bg-blue-100 transition-colors cursor-pointer" onClick={() => handleSearch("T-CON V-By-One components")}>
                  <CardHeader className="pb-2">
                    <Cpu className="w-8 h-8 text-blue-600 mb-1" />
                    <CardTitle className="text-lg">T-CON</CardTitle>
                    <CardDescription className="text-xs">Timing Controllers</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="rounded-3xl border-none bg-indigo-50 shadow-none hover:bg-indigo-100 transition-colors cursor-pointer" onClick={() => handleSearch("4K UHD TV Panels")}>
                  <CardHeader className="pb-2">
                    <Layers className="w-8 h-8 text-indigo-600 mb-1" />
                    <CardTitle className="text-lg">Panels</CardTitle>
                    <CardDescription className="text-xs">LCD & OLED Screens</CardDescription>
                  </CardHeader>
                </Card>
              </section>

              {/* Trending / Recent */}
              <section>
                 <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Recent Inquiries</h2>
                  <TrendingUp className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="space-y-3">
                  {recentSearches.map((query, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSearch(query)}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-zinc-100 cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-zinc-400" />
                        <span className="font-medium text-zinc-700">{query}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-300" />
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4"
            >
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="sm" onClick={() => setSearchResults([])} className="rounded-full gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                <Badge variant="outline" className="rounded-full bg-blue-50 text-blue-700 border-blue-200">
                  {isSearching ? 'Analyzing...' : `${searchResults.length} Components Found`}
                </Badge>
              </div>

              {isSearching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <Card key={i} className="rounded-3xl border-zinc-200 overflow-hidden">
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-6 w-1/2 rounded-full" />
                        <Skeleton className="h-4 w-full rounded-full" />
                        <Skeleton className="h-4 w-3/4 rounded-full" />
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Skeleton className="h-20 w-full rounded-2xl" />
                          <Skeleton className="h-20 w-full rounded-2xl" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((item, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="cursor-pointer"
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    >
                      <Card className={`rounded-3xl border-zinc-200 shadow-sm overflow-hidden transition-all duration-300 ${expandedIndex === idx ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'}`}>
                        <CardHeader className={`${expandedIndex === idx ? 'bg-blue-50/50' : 'bg-zinc-50/50'} pb-3 transition-colors`}>
                          <div className="flex justify-between items-start">
                            <Badge variant="secondary" className="mb-2 bg-white">{item.brand}</Badge>
                            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">{item.type}</span>
                          </div>
                          <CardTitle className="text-xl font-bold flex items-center justify-between gap-2">
                            {item.modelNumber}
                            <motion.div
                              animate={{ rotate: expandedIndex === idx ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="w-5 h-5 text-zinc-400" />
                            </motion.div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                          <p className={`text-sm text-zinc-600 leading-relaxed ${expandedIndex === idx ? '' : 'line-clamp-2'}`}>
                            {item.description}
                          </p>

                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(item.specs).slice(0, expandedIndex === idx ? undefined : 2).map(([k, v]) => (
                              <div key={k} className="p-2 bg-zinc-50 rounded-xl border border-zinc-100">
                                <div className="text-[10px] uppercase font-bold text-zinc-400 mb-0.5">{k}</div>
                                <div className="text-xs font-semibold text-zinc-700 truncate">{v}</div>
                              </div>
                            ))}
                            {expandedIndex !== idx && Object.keys(item.specs).length > 2 && (
                              <div className="flex items-center justify-center text-[10px] font-bold text-blue-500 bg-blue-50 rounded-xl border border-blue-100">
                                +{Object.keys(item.specs).length - 2} MORE
                              </div>
                            )}
                          </div>

                          <AnimatePresence>
                            {expandedIndex === idx && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4 pt-2 overflow-hidden"
                              >
                                {item.relatedModels && item.relatedModels.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-2 px-1">
                                      {item.type === 'T-CON' ? 'Compatible Panels' : 'Similar Models'}
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                      {item.relatedModels.map((model, i) => (
                                        <Badge 
                                          key={i} 
                                          variant="outline" 
                                          className="rounded-full bg-zinc-100 text-zinc-600 border-zinc-200 cursor-pointer hover:bg-zinc-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSearch(model);
                                          }}
                                        >
                                          {model}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {item.sources.length > 0 && (
                                  <div>
                                    <h4 className="text-[10px] font-bold text-zinc-400 uppercase mb-2 px-1">Verified Resources</h4>
                                    <div className="flex flex-col gap-2">
                                      {item.sources.map((src, i) => (
                                        <Button 
                                          key={i} 
                                          variant="outline" 
                                          size="sm" 
                                          className="justify-between rounded-2xl w-full text-[11px] h-10 bg-zinc-50 hover:bg-zinc-100 px-4"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(src.uri, '_blank');
                                          }}
                                        >
                                          <div className="flex items-center">
                                            <ImageIcon className="w-4 h-4 mr-2 text-zinc-400" />
                                            <span className="truncate max-w-[200px]">{src.title}</span>
                                          </div>
                                          <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                                        </Button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Android Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-zinc-200 flex items-center justify-around z-40 px-6">
        <button onClick={() => setSearchResults([])} className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-full group-hover:bg-zinc-100">
            <Tv className={`w-6 h-6 ${!searchResults.length ? 'text-blue-600' : 'text-zinc-400'}`} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-tight ${!searchResults.length ? 'text-blue-600' : 'text-zinc-400'}`}>Home</span>
        </button>
        <button onClick={() => setIsOverlayOpen(true)} className="flex flex-col items-center gap-1 group">
          <div className="p-1 rounded-full group-hover:bg-zinc-100">
            <Search className="w-6 h-6 text-zinc-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-400">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 group opacity-40 cursor-not-allowed">
          <div className="p-1 rounded-full group-hover:bg-zinc-100">
            <History className="w-6 h-6 text-zinc-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-tight text-zinc-400">Library</span>
        </button>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isOverlayOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 flex flex-col"
          >
            <div className="flex items-center gap-3 p-4 border-b border-zinc-100">
              <Button variant="ghost" size="icon" onClick={() => setIsOverlayOpen(false)} className="rounded-full">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <Input 
                autoFocus
                placeholder="Model number (e.g. HV550QUB)"
                className="flex-1 rounded-full bg-zinc-100 border-none h-12 px-5 focus-visible:ring-2 focus-visible:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4 px-2 tracking-widest">Suggestions</h3>
              <div className="space-y-1">
                {['HV550QUB-N5E', 'ST5461D04-1-C-7', 'T-CON T550HVN08', 'BOE HV430QUB'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSearch(term)}
                    className="w-full flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-2xl text-left transition-colors"
                  >
                    <Search className="w-4 h-4 text-zinc-300" />
                    <span className="font-medium text-zinc-700">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

