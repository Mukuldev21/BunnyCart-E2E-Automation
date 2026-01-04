export const generateHtml = (data: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Touch | ${data.env.Project}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        [x-cloak] { display: none !important; }
        .tab-active { border-bottom: 2px solid #3b82f6; color: #3b82f6; }
    </style>
</head>
<body class="bg-[#f9fafb] text-[#111827]" x-data="reportApp()">
    
    <header class="bg-white border-b border-gray-200 px-8 py-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <h1 class="text-xl font-bold flex items-center gap-2">
                    <span class="text-blue-600">📂</span> ${data.env.Project}
                </h1>
                <p class="text-xs text-gray-500 mt-1 uppercase tracking-wider font-medium">
                    ${data.env.Browser} • ${data.env.Platform} • ${new Date().toLocaleTimeString()}
                </p>
            </div>
            <button @click="window.print()" class="text-gray-400 hover:text-gray-600 no-print">🗑️</button>
        </div>
        
        <nav class="flex gap-8 mt-6 text-sm font-semibold text-gray-400 no-print">
            <a href="#" @click.prevent="activeTab = 'summary'" :class="activeTab === 'summary' ? 'tab-active pb-2' : 'pb-2 hover:text-gray-600'">Summary</a>
            <a href="#" @click.prevent="activeTab = 'specs'" :class="activeTab === 'specs' ? 'tab-active pb-2' : 'pb-2 hover:text-gray-600'">Specs</a>
            <a href="#" @click.prevent="activeTab = 'history'" :class="activeTab === 'history' ? 'tab-active pb-2' : 'pb-2 hover:text-gray-600'">History</a>
            <a href="#" @click.prevent="activeTab = 'ai'" :class="activeTab === 'ai' ? 'tab-active pb-2' : 'pb-2 hover:text-gray-600 text-blue-500'">✨ AI Insights</a>
        </nav>
    </header>

    <main class="max-w-7xl mx-auto p-8 space-y-6">
        
        <!-- SUMMARY TAB -->
        <div x-show="activeTab === 'summary'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 transform scale-95" x-transition:enter-end="opacity-100 transform scale-100">
            
            <!-- Top Stats Row -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <!-- Pass Rate Card -->
                <div class="md:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                    <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div class="relative w-32 h-32">
                        <svg class="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" stroke-width="8" fill="transparent" 
                                    :class="passRate >= 90 ? 'text-green-500' : (passRate >= 50 ? 'text-amber-500' : 'text-red-500')"
                                    :stroke-dasharray="351.86" :stroke-dashoffset="351.86 - (351.86 * passRate / 100)" stroke-linecap="round" />
                        </svg>
                        <div class="absolute top-0 left-0 w-full h-full flex items-center justify-center flex-col">
                            <span class="text-3xl font-bold text-gray-800" x-text="passRate + '%'"></span>
                            <span class="text-xs text-gray-400 uppercase tracking-wider">Pass Rate</span>
                        </div>
                    </div>
                </div>

                <!-- Key Metrics Grid -->
                <div class="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Tests</p>
                        <p class="text-2xl font-bold text-gray-800" x-text="stats.total"></p>
                    </div>
                     <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm border-l-4 border-l-green-500">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Passed</p>
                        <p class="text-2xl font-bold text-green-600" x-text="stats.passed"></p>
                    </div>
                     <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm border-l-4 border-l-red-500">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Failed</p>
                        <p class="text-2xl font-bold text-red-600" x-text="stats.failed"></p>
                    </div>
                     <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm border-l-4 border-l-amber-500">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Flaky</p>
                        <p class="text-2xl font-bold text-amber-600" x-text="stats.flaky"></p>
                    </div>
                    
                    <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Duration</p>
                        <p class="text-xl font-bold text-gray-800" x-text="(stats.duration / 1000).toFixed(1) + 's'"></p>
                    </div>
                     <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Avg Time</p>
                        <p class="text-xl font-bold text-gray-800" x-text="stats.avgDuration + 'ms'"></p>
                    </div>
                     <div class="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm col-span-2">
                        <p class="text-xs text-gray-400 uppercase tracking-wider mb-1">Environment</p>
                        <div class="flex items-center gap-2 text-sm font-medium text-gray-600">
                             <span x-text="env.Browser"></span>
                             <span class="text-gray-300">•</span>
                             <span x-text="env.Platform"></span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Suite Overview -->
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 class="font-bold text-gray-700">TestSuite Overview</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left">
                        <thead class="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th class="px-6 py-3">File Name</th>
                                <th class="px-6 py-3 text-center">Tests</th>
                                <th class="px-6 py-3 text-center">Passed</th>
                                <th class="px-6 py-3 text-center">Failed</th>
                                <th class="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <template x-for="(tests, file) in groupedTests" :key="file">
                                <tr class="hover:bg-gray-50/50">
                                    <td class="px-6 py-4 font-medium text-gray-900" x-text="file"></td>
                                    <td class="px-6 py-4 text-center text-gray-600" x-text="tests.length"></td>
                                    <td class="px-6 py-4 text-center text-green-600 font-bold" x-text="tests.filter(t => t.status === 'passed').length"></td>
                                    <td class="px-6 py-4 text-center text-red-600 font-bold" x-text="tests.filter(t => t.status === 'failed').length"></td>
                                    <td class="px-6 py-4 text-right">
                                        <span class="px-2 py-1 rounded text-xs font-bold" 
                                              :class="tests.some(t => t.status === 'failed') ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'"
                                              x-text="tests.some(t => t.status === 'failed') ? 'FAIL' : 'PASS'">
                                        </span>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- SPECS TAB -->
        <div x-show="activeTab === 'specs'" x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-0">
                <div class="p-6 border-b border-gray-100 flex justify-between items-center">
                    <div>
                        <h3 class="font-bold text-lg">Detailed Analysis</h3>
                        <p class="text-xs text-gray-400">Detailed breakdown of test suites and cases</p>
                    </div>
                    <div class="flex gap-2 no-print">
                        <input type="text" x-model="search" placeholder="e.g. s:failed" class="border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>

                <div class="px-6 py-4 flex gap-2 border-b border-gray-50 bg-gray-50/50 no-print">
                    <button @click="filter = 'all'" :class="filter === 'all' ? 'bg-white shadow text-blue-600' : 'text-gray-500'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition">All (${data.stats.total})</button>
                    <button @click="filter = 'passed'" :class="filter === 'passed' ? 'bg-white shadow text-green-600' : 'text-gray-500'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition">Passed (${data.stats.passed})</button>
                    <button @click="filter = 'failed'" :class="filter === 'failed' ? 'bg-white shadow text-red-600' : 'text-gray-500'" class="px-4 py-1.5 rounded-lg text-xs font-bold transition">Failed (${data.stats.failed})</button>
                </div>

                <div class="divide-y divide-gray-100">
                    <template x-for="(tests, suite) in groupedTests" :key="suite">
                        <div class="p-6">
                            <div class="flex items-center gap-2 mb-4">
                                <span class="text-gray-800 font-bold text-sm" x-text="suite"></span>
                                <span class="text-[10px] text-gray-400 font-medium" x-text="'(' + tests.length + ' test cases)'"></span>
                            </div>

                            <div class="space-y-4">
                                <template x-for="test in tests" :key="test.id">
                                    <div class="flex flex-col border-b border-gray-50 pb-4 last:border-0">
                                        <div class="flex items-center justify-between group cursor-pointer" @click="test.open = !test.open">
                                            <div class="flex items-center gap-3">
                                                <span x-text="test.status === 'passed' ? '✅' : '❌'"></span>
                                                <span class="text-sm font-medium text-gray-700" x-text="test.title"></span>
                                                <span class="bg-blue-50 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-bold" x-text="'@' + env.Browser"></span>
                                            </div>
                                            <div class="flex items-center gap-4">
                                                <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded" x-text="test.duration + 'ms Total'"></span>
                                                <span class="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded font-bold no-print">✨ AI Insight</span>
                                            </div>
                                        </div>

                                        <div x-show="test.open" x-cloak class="mt-4 bg-gray-900 rounded-xl p-4 no-print">
                                            
                                            <!-- Steps Section -->
                                            <div class="mb-6 space-y-1">
                                                <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Execution Steps</p>
                                                <template x-for="step in test.steps" :key="step.title">
                                                    <div class="flex justify-between items-center text-xs py-1 px-2 rounded hover:bg-white/5 transition border-l-2" 
                                                         :class="step.error ? 'border-red-500 text-red-300' : 'border-green-500 text-gray-400'">
                                                        <span x-text="step.title"></span>
                                                        <span x-text="step.duration + 'ms'" class="opacity-50 text-[10px]"></span>
                                                    </div>
                                                </template>
                                            </div>

                                            <template x-if="test.error">
                                                <pre class="text-red-400 text-xs overflow-x-auto whitespace-pre-wrap border-t border-gray-800 pt-4" x-text="test.error"></pre>
                                            </template>

                                            <div class="grid grid-cols-2 gap-4 mt-4">
                                                <template x-for="img in test.screenshots">
                                                    <img :src="img.base64" class="rounded-lg border border-gray-700 w-full cursor-zoom-in">
                                                </template>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        
        <!-- HISTORY & AI PLACEHOLDERS -->
        <div x-show="activeTab === 'history'" class="p-12 text-center text-gray-400">
             <h2 class="text-2xl font-bold mb-2">History & Trends</h2>
             <p>Historical test run data will appear here.</p>
        </div>
        <div x-show="activeTab === 'ai'" class="p-12 text-center text-gray-400">
             <h2 class="text-2xl font-bold mb-2 text-blue-500">✨ AI Insights</h2>
             <p>AI-driven failure analysis and pattern detection module coming soon.</p>
        </div>
    </main>

    <script>
        function reportApp() {
            return {
                activeTab: 'summary',
                search: '',
                filter: 'all',
                stats: ${JSON.stringify(data.stats)},
                get passRate() {
                    return this.stats.total > 0 ? Math.round((this.stats.passed / this.stats.total) * 100) : 0;
                },
                env: ${JSON.stringify(data.env)},
                tests: ${JSON.stringify(data.tests)}.map(t => ({...t, open: false})),
                get groupedTests() {
                    const filtered = this.tests.filter(t => {
                        const matchF = this.filter === 'all' || t.status === this.filter;
                        const matchS = t.title.toLowerCase().includes(this.search.toLowerCase());
                        return matchF && matchS;
                    });
                    return filtered.reduce((groups, test) => {
                        (groups[test.file] = groups[test.file] || []).push(test);
                        return groups;
                    }, {});
                }
            }
        }
    </script>
</body>
</html>
`;