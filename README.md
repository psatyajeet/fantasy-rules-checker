To run locally:
```
npx ts-node src/yahooApi.ts
```

To push to production (deployed as AWS lambda under FantasyRulesChecker)
```
tsc
zip -r fantasy-rules-checker.zip .
```


Yahoo API guide: https://developer.yahoo.com/fantasysports/guide/
Yahoo OAuth Flow: https://developer.yahoo.com/oauth2/guide/flows_authcode/