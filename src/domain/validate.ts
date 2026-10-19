import type { Catalogue, Statement } from './types'

/**
 * Referential-integrity and provenance checks for a catalogue.
 * Returns human-readable problems; an empty array means the catalogue is consistent.
 * Rules:
 * - every referenced id exists;
 * - verified and interpretation statements cite at least one source;
 * - every opportunity lists what must be validated;
 * - an opportunity only responds to challenges documented in one of its territories.
 */
export function validateCatalogue(catalogue: Catalogue): string[] {
  const problems: string[] = []
  const ids = {
    country: new Set(catalogue.countries.map((c) => c.code)),
    territory: new Set(catalogue.territories.map((t) => t.id)),
    ecosystem: new Set(catalogue.ecosystems.map((e) => e.id)),
    theme: new Set(catalogue.themes.map((t) => t.id)),
    challenge: new Set(catalogue.challenges.map((c) => c.id)),
    source: new Set(catalogue.sources.map((s) => s.id)),
  }

  const ref = (kind: keyof typeof ids, id: string | undefined, where: string) => {
    if (id !== undefined && !ids[kind].has(id)) problems.push(`${where}: unknown ${kind} "${id}"`)
  }
  const statement = (s: Statement, where: string) => {
    s.sourceIds.forEach((id) => ref('source', id, where))
    if (s.evidence !== 'hypothesis' && s.sourceIds.length === 0) {
      problems.push(`${where}: ${s.evidence} statement has no source — "${s.text.slice(0, 60)}"`)
    }
  }

  for (const [kind, list] of [
    ['territory', catalogue.territories],
    ['challenge', catalogue.challenges],
    ['opportunity', catalogue.opportunities],
    ['organisation', catalogue.organisations],
    ['source', catalogue.sources],
  ] as const) {
    const seen = new Set<string>()
    for (const item of list) {
      if (seen.has(item.id)) problems.push(`duplicate ${kind} id "${item.id}"`)
      seen.add(item.id)
    }
  }

  for (const t of catalogue.territories) {
    const where = `territory ${t.id}`
    ref('country', t.countryCode, where)
    ref('territory', t.parentId, where)
    ref('source', t.location.pointSourceId, where)
    t.location.descriptionSourceIds.forEach((id) => ref('source', id, where))
    ref('source', t.geometry.sourceId, where)
    if (t.geometry.representation === 'boundary' && !t.geometry.featureRef) {
      problems.push(`${where}: boundary geometry without featureRef`)
    }
    t.overview.forEach((s) => statement(s, where))
    t.livelihoods.forEach((s) => statement(s, where))
    t.ecosystems.forEach((e) => {
      ref('ecosystem', e.ecosystemId, where)
      statement(e, where)
    })
  }

  for (const c of catalogue.challenges) {
    const where = `challenge ${c.id}`
    c.territoryIds.forEach((id) => ref('territory', id, where))
    c.themeIds.forEach((id) => ref('theme', id, where))
    c.statements.forEach((s) => statement(s, where))
  }

  for (const o of catalogue.opportunities) {
    const where = `opportunity ${o.id}`
    o.territoryIds.forEach((id) => ref('territory', id, where))
    o.themeIds.forEach((id) => ref('theme', id, where))
    o.challengeIds.forEach((id) => {
      ref('challenge', id, where)
      const challenge = catalogue.challenges.find((c) => c.id === id)
      if (challenge && !challenge.territoryIds.some((t) => o.territoryIds.includes(t))) {
        problems.push(`${where}: linked challenge "${id}" shares no territory with it`)
      }
    })
    o.rationale.forEach((s) => statement(s, where))
    if (o.validationNeeded.length === 0) problems.push(`${where}: no validationNeeded items`)
    if ((o.evidence as string) === 'verified') problems.push(`${where}: opportunities cannot be verified`)
  }

  for (const o of catalogue.organisations) {
    const where = `organisation ${o.id}`
    o.territoryIds.forEach((id) => ref('territory', id, where))
    statement(o.role, where)
  }

  return problems
}
