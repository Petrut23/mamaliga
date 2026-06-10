const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

// Adauga relatie in Season
schema = schema.replace(
  `  rounds          Round[]
  overallRankings OverallRanking[]
}`,
  `  rounds          Round[]
  overallRankings OverallRanking[]
  seasonRankings  SeasonRanking[]
}`
)

// Adauga relatie in User - cautam sfarsitul modelului User
schema = schema.replace(
  `  overallRankings  OverallRanking[]`,
  `  overallRankings  OverallRanking[]
  seasonRankings   SeasonRanking[]`
)

fs.writeFileSync('prisma/schema.prisma', schema)
console.log('Gata!')