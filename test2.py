from TwitterAPI import TwitterAPI
api = TwitterAPI("aiC1HsGnI81CrWQ78ejw","244t73B6eDybGbxPrqcxfXMjdfy3OBeqKndcnBakE5M","237561704-JIg6SthgLfZge8naa7Pun3ANpSo3r0BprtlrLFto","7FGLhL5UFW0F1RWRraF3HqPvY5cvhmOXMQt2FKjxC0")


r = api.request('statuses/user_timeline', {'user_id':'jukebapes'})

for item in r:
	print item['text']