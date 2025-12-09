import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/my-trip/', // ⚠️ 關鍵：這裡要填您的 GitHub Repository 名稱，前後要有斜線
})
```

### 修改完這個檔案後，您已經完成了所有準備工作！ 🚀

現在，請回到終端機，執行最後的部署指令：

```bash
git add .
git commit -m "Configure deployment settings"
git push
npm run deploy