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
            <a href="#" class="tab-active pb-2">Summary</a>
            <a href="#" class="pb-2 hover:text-gray-600">Specs</a>
            <a href="#" class="pb-2 hover:text-gray-600">History</a>
            <a href="#" class="pb-2 hover:text-gray-600 text-blue-500">✨ AI Insights</a>
        </nav>
    </header>

    <main class="max-w-7xl mx-auto p-8 space-y-6">
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Failed</p>
                        <h2 class="text-4xl font-bold mt-1" x-text="stats.failed"></h2>
                    </div>
                    <span class="text-red-500 bg-red-50 px-2 py-1 rounded text-xs">❌</span>
                </div>
                <div class="mt-4 space-y-2 text-xs text-gray-400">
                    <div class="flex justify-between"><span>Assertion Failures</span><span x-text="stats.failed"></span></div>
                    <div class="flex justify-between font-medium text-gray-300 italic"><span>Other Failures</span><span>0</span></div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Flaky</p>
                        <h2 class="text-4xl font-bold mt-1" x-text="stats.flaky"></h2>
                    </div>
                    <span class="text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs">⚠️</span>
                </div>
                <div class="mt-4 space-y-2 text-xs text-gray-400">
                    <div class="flex justify-between italic"><span>Timing Related</span><span>0</span></div>
                    <div class="flex justify-between italic"><span>Environment Dependent</span><span>0</span></div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="text-sm font-medium text-gray-500">Skipped</p>
                        <h2 class="text-4xl font-bold mt-1" x-text="stats.skipped"></h2>
                    </div>
                    <span class="text-blue-500 bg-blue-50 px-2 py-1 rounded text-xs">⏭️</span>
                </div>
            </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-8">
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
                                        <pre class="text-red-400 text-xs overflow-x-auto whitespace-pre-wrap" x-text="test.error || 'No error logs available'"></pre>
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
    </main>

    <script>
        function reportApp() {
            return {
                search: '',
                filter: 'all',
                stats: ${JSON.stringify(data.stats)},
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