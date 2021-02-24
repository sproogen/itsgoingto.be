# itsgoingto.be ![Build Status](https://github.com/sproogen/itsgoingto.be/actions/workflows/ci-workflow.yml/badge.svg?branch=master) [![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=sproogen%3Aitsgoingto.be&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=sproogen%3Aitsgoingto.be) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=sproogen%3Aitsgoingto.be&metric=coverage)](https://sonarcloud.io/dashboard?id=sproogen%3Aitsgoingto.be)

NodeJS and React magic behind [itsgoingto.be]

The Node backend can be found in the `server` folder and the React app can be found in the `app` folder.

Getting started
-------------
You will need to have [Docker] installed and running, aswell as Node and NPM.

Clone the repository into a local folder.

Now inside the project folder run
```
./app/docker-build.sh
./server/docker-build.sh
docker-compose up
```

You will now be able to access the app at `http://localhost:8000`, storybook at `http://localhost:6006` and swagger at `http://localhost:4000`.
Everytime you make a change to the app or storybook stories the app will automatically rebuild and refresh in the browser.

*Note: If you make any changes to the packages in the app or server you will need to re-run the relevant `docker-build.sh` script.*

Running tests
-------------
###### App
To test the React app, run the folowwing from inside the `app` folder.

`npm run lint` to run the linter.
`npm run test` to run all the unit tests using jest.

###### Server
To test the Node Server, run the folowwing from inside the `server` folder.

`npm run lint` to run the linter.
`npm run test` to run all the unit tests using jest.

*Note: You will need to have [Docker] running to run the server tests, as this uses a docker container for a mysql server.*

API
-------------
API documentation can be found at [server/swagger.yml](server/swagger.yml)

Copyright
-------------
```
Copyright (c) 2018 James Grant
```

License
-------------
```
ItsGoingToBe is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ItsGoingToBe is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ItsGoingToBe.  If not, see <http://www.gnu.org/licenses/>.
```

[itsgoingto.be]: http://itsgoingto.be/
[Docker]: https://docs.docker.com/get-started/
