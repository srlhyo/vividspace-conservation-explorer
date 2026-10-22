"""When each country's sources were checked: the access and review date written on its records."""
DEFAULT = '2026-10-20'
BY_COUNTRY = {'CMR': '2026-10-22', 'COG': '2026-10-22', 'COD': '2026-10-22'}
LATEST = max([DEFAULT, *BY_COUNTRY.values()])

def accessed(code):
    return BY_COUNTRY.get(code, DEFAULT)
