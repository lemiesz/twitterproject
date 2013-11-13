from TwitterAPI import TwitterAPI
api = TwitterAPI("aiC1HsGnI81CrWQ78ejw","244t73B6eDybGbxPrqcxfXMjdfy3OBeqKndcnBakE5M","237561704-JIg6SthgLfZge8naa7Pun3ANpSo3r0BprtlrLFto","7FGLhL5UFW0F1RWRraF3HqPvY5cvhmOXMQt2FKjxC0")

lon = -88.207270
lat = 40.110588

for i in range(100):
	geocode = str(lat) + ',' + str(lon) + ',' + '100mi'
	r = api.request('statuses/user_timeline', {'geocode' : geocode,'limit' : '100'})
	for item in r.get_iterator():
		print item['text']
	lat+=4
	lon+=4
