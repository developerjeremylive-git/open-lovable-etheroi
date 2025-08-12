#!/bin/bash

echo "🚀 Installing CodeMind Collective Multi-Agent System..."

# Install new dependencies
echo "📦 Installing LangChain and multi-agent dependencies..."
npm install @langchain/anthropic@^0.3.7 @langchain/community@^0.3.15 @langchain/core@^0.3.21 @langchain/google-genai@^0.1.3 @langchain/openai@^0.3.12 langchain@^0.3.6 uuid@^11.0.3

# Install dev dependencies
echo "📦 Installing development dependencies..."
npm install --save-dev @types/uuid@^10.0.0

echo "✅ Dependencies installed successfully!"

echo ""
echo "🎯 Setup Complete! Your multi-agent system is ready."
echo ""
echo "🔧 Next steps:"
echo "1. Make sure your .env.local has the required API keys:"
echo "   - OPENAI_API_KEY (for GPT models)"
echo "   - ANTHROPIC_API_KEY (for Claude models)"  
echo "   - GOOGLE_API_KEY (for Gemini models)"
echo "   - E2B_API_KEY (for sandboxes)"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Access the multi-agent system:"
echo "   - Classic mode: http://localhost:3000"
echo "   - Multi-agent mode: http://localhost:3000/multi-agent"
echo ""
echo "🚀 Ready to revolutionize development with CodeMind Collective!"