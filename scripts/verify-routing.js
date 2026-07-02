const { execSync } = require('child_process');
const path = require('path');

const routeScriptPath = path.join(__dirname, 'route.js');

const testCases = [
  {
    query: "帮我 debug 一下这个 React 组件的渲染 bug",
    expectedCategory: "engineering",
    expectedSubcategory: "development/diagnose",
    description: "Ambiguous query: contains both frontend (React, render, component) and debug/bug. Should route to engineering debug."
  },
  {
    query: "帮我优化一下接口响应速度",
    expectedCategory: "engineering",
    expectedSubcategory: "development/diagnose",
    description: "Chinese performance optimization query. Should route to engineering."
  },
  {
    query: "帮我用 HTML/CSS 还原这个页面的 UI 样式",
    expectedCategory: "frontend",
    expectedSubcategory: "web-frontend",
    description: "Chinese frontend query. Should route to frontend."
  },
  {
    query: "部署 Nginx 反向代理和域名证书",
    expectedCategory: "deployment",
    expectedSubcategory: "nginx",
    description: "Chinese deployment query. Should route to deployment."
  },
  {
    query: "帮我写一篇关于技术规范的设计文档",
    expectedCategory: "document",
    expectedSubcategory: "writing",
    description: "Chinese document writing query. Should route to document."
  },
  {
    query: "如何设计一个自主技能路由方案",
    expectedCategory: "ai-agent",
    expectedSubcategory: "skill-design",
    description: "Chinese ai-agent routing query. Should route to ai-agent."
  },
  {
    query: "Help me optimize this digital system",
    expectedCategory: "engineering",
    expectedSubcategory: "development/diagnose",
    description: "Word boundary check: 'digital' contains 'git' which is an engineering keyword, but it shouldn't match 'git'. It routes to engineering because of 'optimize'."
  },
  {
    query: "如何开启 claude-mem 查看历史会话上下文",
    expectedCategory: "ai-agent",
    expectedSubcategory: "agent-memory",
    description: "Memory context queries should route to agent-memory subcategory under ai-agent."
  },
  {
    query: "使用 Chrome DevTools 截图当前页面并抓取报错日志",
    expectedCategory: "frontend",
    expectedSubcategory: "browser-automation",
    description: "Browser automation / devtools queries should route to browser-automation subcategory under frontend."
  }
];

console.log("🚀 Starting Super-Skill-Router Routing Verification Tests...\n");
let passedCount = 0;

testCases.forEach((tc, index) => {
  console.log(`[Test ${index + 1}] Query: "${tc.query}"`);
  console.log(`Expected: Category = "${tc.expectedCategory}", Subcategory = "${tc.expectedSubcategory}"`);
  
  try {
    const cmd = `node "${routeScriptPath}" --query "${tc.query}"`;
    const stdout = execSync(cmd, { encoding: 'utf8' });
    const decision = JSON.parse(stdout);
    
    console.log(`Actual: Category = "${decision.category}", Subcategory = "${decision.subcategory}", Confidence = "${decision.confidence}"`);
    console.log(`Reason: ${decision.routingReason}`);
    
    let isOk = true;
    if (decision.category !== tc.expectedCategory) {
      console.error(`❌ Category MISMATCH! Expected ${tc.expectedCategory}, got ${decision.category}`);
      isOk = false;
    }
    if (decision.subcategory !== tc.expectedSubcategory) {
      console.error(`❌ Subcategory MISMATCH! Expected ${tc.expectedSubcategory}, got ${decision.subcategory}`);
      isOk = false;
    }
    
    if (isOk) {
      console.log("✅ PASSED");
      passedCount++;
    } else {
      console.log("❌ FAILED");
    }
  } catch (err) {
    console.error(`❌ Execution FAILED with error: ${err.message}`);
  }
  console.log("-".repeat(60) + "\n");
});

console.log(`Testing Completed. Passed: ${passedCount} / ${testCases.length}`);

if (passedCount === testCases.length) {
  console.log("\n💯 All routing tests passed flawlessly!");
  process.exit(0);
} else {
  console.error("\n⚠️ Some test cases failed.");
  process.exit(1);
}
