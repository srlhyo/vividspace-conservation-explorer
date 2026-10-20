import re, unicodedata
GENERIC = r"""national|nationale?|nacional|parks?|parc|parque|marine|marin[ea]?|maritime|reserves?|réserves?|reserva|reservas|réserve|
  nature|naturelle?|natural|naturais?|strict|integral|intégrale|partial|partielle|game|wildlife|faune|fauna|faunal|forest|forêt|floresta|
  sanctuary|sanctuaire|santuário|protected|protégée?s?|protegida|area|aire|área|zone|zona|conservation|conservancy|communal|community|
  communautaire|comunitária|ramsar|site|wetlands?|system|complex|of|the|de|du|des|la|le|les|da|do|das|dos|et|and|e|d|l|mpa|amp|np|pn|gr|fr|
  biosphere|biosphère|classified|classée?|management|ecological|écologique|ecologica|transboundary|transfrontier|protectorate|recreation|controlled|
  open|valley|island|islands|îles?|ilha|ilhas|lake|lac|lago|river|rivière|rio|bay|baie|baía|mountains?|mount|monts?|montes?|hills?"""
def ascii(s): return unicodedata.normalize('NFKD', re.sub(r"[’‘ʼ'`´]", ' ', s)).encode('ascii', 'ignore').decode().lower()
ascii_ = ascii
GEN = re.compile('^(?:' + ascii_(re.sub(r'\s+', '', GENERIC)) + ')$')
def tokens(name):
    return [w for w in re.findall(r'[a-z0-9]+', ascii(name))]
def core(name):
    """Distinctive words of a protected-area name (generic designation words removed)."""
    t = [w for w in tokens(name) if not GEN.match(w) and len(w) > 1]
    return t
def same(a, b):
    """Same distinctive words: treated as the same area (still listed for review)."""
    ca, cb = core(a), core(b)
    return bool(ca) and sorted(ca) == sorted(cb)
def similar(a, b):
    """One name's distinctive words contain the other's: a candidate for manual review only."""
    sa, sb = set(core(a)), set(core(b))
    return bool(sa and sb) and (sa <= sb or sb <= sa)
def slug(name): return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', ascii(name))).strip('-')[:60]
