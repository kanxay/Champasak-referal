# ແຜນແນະນຳວິທີເບິ່ງລິ້ງ Vercel ຕົວຈິງ & ການໃສ່ Environment Variables

ຄູ່ມືແກ້ໄຂບັນຫາ `DNS_PROBE_FINISHED_NXDOMAIN` ແລະ ຂັ້ນຕອນການເປີດເບິ່ງລິ້ງໂດເມນທີ່ Vercel ສ້າງໃຫ້ແທ້, ພ້ອມວິທີຕັ້ງຄ່າ Environment Variables ຂອງ Turso ເພື່ອໃຫ້ເວັບໄຊໃຊ້ງານໄດ້ສົມບູນ.

## User Review & Critical Decisions

> [!IMPORTANT]
> ສາເຫດທີ່ເກີດ `DNS_PROBE_FINISHED_NXDOMAIN`:
> - ໂດເມນ `champasak-referal.vercel.app` ເປັນພຽງຕົວຢ່າງ, ເມື່ອທ່ານກົດ Deploy ໃນ Vercel ລະບົບຈະສ້າງ URL ສະເພາະຂອງໂຄງການທ່ານເອງ (ເຊັ່ນ: `champasak-xxxx.vercel.app`).
> - ເນື່ອງຈາກທ່ານໄດ້ Push ຂຶ້ນ GitHub ແລະ ກົດ Deploy ແລ້ວ, ສິ່ງທີ່ຕ້ອງເຮັດມີພຽງ 2 ຢ່າງ:
>   1. ເບິ່ງ Domain URL ຕົວຈິງໃນໜ້າ Dashboard ຂອງ Vercel.
>   2. ເພີ່ມ Environment Variables (`VITE_TURSO_DATABASE_URL` ແລະ `VITE_TURSO_AUTH_TOKEN`) ໃນ Vercel Settings ແລ້ວກົດ Redeploy.

---

## 1. ຂັ້ນຕອນການຊອກຫາລິ້ງ Vercel ຕົວຈິງ

1. **ເຂົ້າໄປທີ່ Vercel Dashboard**:
   - ເຂົ້າເວັບໄຊ [vercel.com/dashboard](https://vercel.com/dashboard).
   - ກົດເຂົ້າໂຄງການ (Project) ຂອງທ່ານທີ່ຫາກໍ່ Deploy.
2. **ເບິ່ງລິ້ງຢູ່ໜ້າ Project Overview**:
   - ຢູ່ກ້ອງຊື່ໂຄງການ ຈະມີຄຳວ່າ **"Domains"** ຫຼື ປຸ່ມຮູບພາບໜ້າຈໍເວັບ (Preview).
   - ຈະເຫັນລິ້ງທີ່ລົງທ້າຍດ້ວຍ `.vercel.app` (ກົດໃສ່ລິ້ງນັ້ນເພື່ອເປີດເວັບໄດ້ທັນທີ).

---

## 2. ຂັ້ນຕອນການໃສ່ Environment Variables (Turso) ໃນ Vercel

ເນື່ອງຈາກທ່ານຍັງບໍ່ທັນໄດ້ຕັ້ງຄ່າ Environment Variables, ໃຫ້ປະຕິບັດຕາມນີ້:

1. ຢູ່ໜ້າໂຄງການຂອງທ່ານໃນ Vercel, ກົດແຖບ **Settings** (ຢູ່ເມນູເທິງ).
2. ເລືອກເມນູດ້ານຊ້າຍ **Environment Variables**.
3. ເພີ່ມຕົວແປທີ 1:
   - **Key**: `VITE_TURSO_DATABASE_URL`
   - **Value**: `libsql://cps-transfer-drkanxay.aws-ap-northeast-1.turso.io`
   - ກົດ **Save**.
4. ເພີ່ມຕົວແປທີ 2:
   - **Key**: `VITE_TURSO_AUTH_TOKEN`
   - **Value**: `eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTMxNzczMTcsImlkIjoiMDFhMTgxYjItMzEwMS03NjUzLWE1NTMtNmU3NTE5NTVhM2ZlIiwia2lkIjoiMUZwdThIZk8wS1BBcms5WERTTGhWanNKREJxMWZ2Y2wzY0FIRWl6cFJTUSIsInJpZCI6ImU1YWIyYTcyLWFhNTItNDEyYS1hYWFmLTdhODA3MzJmYjU5ZSJ9.YjMbJyXhS8Mny3IeC72-gv9HDFDDCPOoL_bR_oVi2g37Kn7lpt5tXQWujnRWqkUDDmch5Be_8wyDlPwAoUipDw`
   - ກົດ **Save**.

---

## 3. ຂັ້ນຕອນການ Redeploy (ອັບເດດໃຫ້ເວັບເຊື່ອມຕໍ່ຖານຂໍ້ມູນ)

ຫຼັງຈາກ Save Environment Variables ແລ້ວ ຕ້ອງ Redeploy 1 ຄັ້ງ:
1. ກົດກັບມາທີ່ແຖບ **Deployments** (ຢູ່ເມນູເທິງຂອງ Vercel).
2. ກົດປຸ່ມຈຸດສາມຈຸດ `...` ຢູ່ດ້ານຂວາຂອງ Deployment ລ່າສຸດ.
3. ເລືອກ **Redeploy**.
4. ລໍຖ້າປະມານ 30-40 ວິນາທີ ເມື່ອສຳເລັດ ທ່ານສາມາດກົດເປີດລິ້ງ Vercel ແລະ ທົດລອງສົ່ງຄົນເຈັບໄດ້ທັນທີ!
