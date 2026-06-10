const fs = require('fs')
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8')

schema = schema.replace(
  `  overallRankings OverallRanking[]
}
enum Role {`,
  `  overallRankings OverallRanking[]
  seasonRankings  SeasonRanking[]
}
enum Role {`
)

fs.writeFileSync('prisma/schema.prisma', schema)
console.log('Gata!')