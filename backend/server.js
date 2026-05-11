const express = require('express')
const cors = require('cors')

const comfortRoutes = require('./api/comfort/comfort.routes')
const underwritingRoutes = require('./api/underwriting/underwriting.routes')
const pricingRoutes = require('./api/pricing/pricing.routes')
const partnerRoutes = require('./api/partners/partner.routes')
const pipelineRoutes = require('./api/pipeline/pipeline.routes')
const companyRoutes = require('./api/company/company.routes')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// API routes
app.use('/api', comfortRoutes)
app.use('/api/underwrite', underwritingRoutes)
app.use('/api/pricing', pricingRoutes)
app.use('/api/partners', partnerRoutes)
app.use('/api/pipeline', pipelineRoutes)
app.use('/api/companies', companyRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Comfort Connect backend running on port ${PORT}`)
})

module.exports = app
