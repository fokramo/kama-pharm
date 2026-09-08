# دليل نشر קמא פארם على الإنترنت (Vercel + Neon Postgres)

## الخطوة ١ — إنشاء قاعدة بيانات Postgres مجانية (Neon)
1. ادخل **https://neon.tech** وسجّل الدخول (بحساب GitHub).
2. **Create Project** → اختر منطقة قريبة (مثل *Europe (Frankfurt)*).
3. من صفحة المشروع انسخ **Connection string** (يبدأ بـ `postgresql://...?sslmode=require`).

> بديل: **Supabase** (supabase.com) — استخدم *Connection string* من Project Settings → Database.

## الخطوة ٢ — تهيئة قاعدة البيانات (مرة واحدة من جهازك)
في مجلد المشروع، ضع الرابط في `.env`:
```
DATABASE_URL="postgresql://....?sslmode=require"
```
ثم نفّذ (مع مسار Node):
```powershell
$env:PATH = "C:\Users\ADMIN\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.19.0-win-x64;" + $env:PATH
npm run db:push   # ينشئ الجداول في Postgres
npm run seed      # يملأ الفئات والمنتجات
```
بعدها يمكنك تشغيل الموقع محليًا على نفس القاعدة السحابية عبر `npm run dev`.

## الخطوة ٣ — النشر على Vercel
1. ادخل **https://vercel.com** وسجّل الدخول بحساب **GitHub**.
2. **Add New → Project** → استورد المستودع **fokramo/kama-pharm**.
3. قبل الضغط على Deploy، افتح **Environment Variables** وأضف (انظر `.env.example`):
   - `DATABASE_URL` = رابط Neon
   - `AUTH_SECRET` = نص عشوائي طويل
   - `ADMIN_USERNAME` · `ADMIN_EMAIL` · `ADMIN_PASSWORD` · `ADMIN_PATH`
   - `ANTHROPIC_API_KEY` (لتفعيل المستشار الذكي)
   - `PAYPLUS_*` (عند تفعيل الدفع الحقيقي)
   - `NEXT_PUBLIC_SITE_URL` = عنوان موقعك (مثل `https://kamapharm.co.il`)
   - `NEXT_PUBLIC_FREE_SHIPPING_OVER` = `199` · `NEXT_PUBLIC_SHIPPING_FEE` = `25`
4. **Deploy**. سيبني Vercel المشروع (`prisma generate && next build`) ويمنحك رابطًا.

## الخطوة ٤ — ربط الدومين
في Vercel: **Project → Settings → Domains → Add** → أدخل دومينك، واتّبع تعليمات تعديل سجلّات **DNS** عند مزوّد الدومين (GoDaddy). الشهادة (HTTPS) تُضاف تلقائيًا.

## ملاحظات مهمة
- **رفع صور المنتجات (يعمل أونلاين):** المشروع مهيّأ لاستخدام **Vercel Blob**. في Vercel افتح **Storage → Create → Blob**، وسيُضاف المتغيّر `BLOB_READ_WRITE_TOKEN` تلقائيًا للمشروع — وعندها يعمل رفع الصور من لوحة الإدارة مباشرةً. (بدون هذا المتغيّر، استخدم حقل رابط الصورة URL.)
- **الدفع:** ضع مفاتيح PayPlus الحقيقية في متغيّرات Vercel، وحدّث `PAYPLUS_API_URL` لعنوان الإنتاج عند الانتقال من Sandbox.
- **بعد أي تعديل:** `git add -A && git commit -m "..." && git push` — وVercel ينشر تلقائيًا.
