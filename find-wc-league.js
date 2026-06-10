fetch('https://sports.bzzoiro.com/api/events/?league=27&date_from=2026-06-11&date_to=2026-06-20', {
  headers: { 'Authorization': 'Token 1d70daf4885e4ae9d3514a547fa07490f514f451' }
})
.then(r => r.json())
.then(d => {
  console.log('Total meciuri:', d.count)
  d.results?.forEach(m => console.log(m.id, m.home_team, 'vs', m.away_team, '-', m.event_date?.substring(0,10)))
})
.catch(console.error)