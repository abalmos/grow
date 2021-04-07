## Developing

Install the dependencies using yarn (`yarn install`)

Run the development service with:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Default data

Go to route `/defaults` to load default database (need better app init soon)
Go to route `/fields/upload` to upload a shape file
Go to route `/fields/[id]` to load field weather data (will be done automatically WebWorker in future)
