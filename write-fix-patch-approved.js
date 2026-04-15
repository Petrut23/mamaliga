const fs = require('fs')
let content = fs.readFileSync('app/api/admin/utilizatori/route.ts', 'utf8')

content = content.replace(
  `  const { id, role, receiveEmails } = await req.json()
  const updateData: any = {}
  if (role !== undefined) updateData.role = role
  if (receiveEmails !== undefined) updateData.receiveEmails = receiveEmails`,
  `  const { id, role, receiveEmails, isApproved } = await req.json()
  const updateData: any = {}
  if (role !== undefined) updateData.role = role
  if (receiveEmails !== undefined) updateData.receiveEmails = receiveEmails
  if (isApproved !== undefined) updateData.isApproved = isApproved`
)

fs.writeFileSync('app/api/admin/utilizatori/route.ts', content)
console.log('Gata!')