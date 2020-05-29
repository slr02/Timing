import startList from "../data/startlist.js"; // TODO replace this with a form for creating it // back up db in cloud / sync db with cloud
import { useEffect, useState } from "react";
import Dexie from "dexie";
import moment from "moment";
import Head from "next/head";
Dexie.delete("timing_database"); // get rid of any old database?
const db = new Dexie("timing_database"); // make generic function that can be used here and in getInitialProps
db.version(1).stores({
  riders: "number,name,category,startTime,finishTime",
  startTime: "time"
});
// TODO london()
// clear the database,

// add in each rider from start list /TODO only if they don't exist already
// startList.map(rider => {
//   db.riders.put({
//     number: rider.raceNumber,
//     name: rider.firstName + ' ' + rider.surname,
//     category: rider.category,
//     startTime: 0,
//     finishTime: 0
//   })
// })

// get riders from database

// function convertMS( milliseconds ) {
//   const seconds = milliseconds / 1000;
//   const completeSeconds = Math.floor(seconds);
//   const tenths = Math.round((seconds - completeSeconds) * 10);
//   const minutes = Math.floor(completeSeconds / 60);
//   const hours = Math.floor(minutes / 60);
//   const days = Math.floor(hours / 24);
//   return {
//       days,
//       hours: hours % 24,
//       minutes: minutes % 60,
//       seconds: completeSeconds % 60,
//       tenths,
//   };
// }

async function getRiders(db) {
  return db.riders.toArray();
}
async function getStartTime(db) {
  db.startTime.get(1, startTime => console.log(startTime));
  return 500; // db.startTime.toArray()[0]// TODO better way of getting this
}

const Index = ({ results }) => {
  const [riders, setRiders] = useState([]);
  const [startTime, setStartTime] = useState(0);
  useEffect(() => {
    const db = new Dexie("timing_database");
    db.version(1).stores({
      riders: "number,name,category,startTime,finishTime",
      startTime: "time"
    });
    // add in each rider from start list //TODO only if they don't exist already
    startList.map(rider => {
      // get promises if no then
      db.riders.put({
        number: rider.raceNumber,
        name: `${rider.firstName} ${rider.surname}`,
        category: rider.category
      });
    });
  }, []);
  useEffect(async () => {
    const db = new Dexie("timing_database");
    db.version(1).stores({
      riders: "number,name,category,startTime,finishTime",
      startTime: "time"
    });
    const ridersData = await getRiders(db);
    setRiders(ridersData);
  }, []);
  return (
    <>
      <Head />
      <div>
        <p>start time: {startTime}</p>
        <button
          onClick={async () => {
            db.startTime.put({ time: moment().valueOf() });
            const startData = await getStartTime(db); // TODO better way this then
            console.log(startData);
            setStartTime(startData);
          }}
        >
          start
        </button>
        {riders.map((
          rider // TODO get these from database not file
        ) => (
          <div key={rider.number} style={{ marginBottom: "30px" }}>
            Rider number: {rider.number}
            <br />
            Rider name: {rider.name}
            <br />
            Finish Time:{" "}
            {rider.finishTime &&
              moment
                .utc(moment.duration(rider.finishTime).asMilliseconds())
                .format("HH:mm:ss")}
            <br />
            <button
              onClick={async () => {
                const db = new Dexie("timing_database");
                const finishTime = moment().valueOf();
                db.version(1).stores({
                  riders: "number,name,category,startTime,finishTime"
                });
                db.riders.put({
                  ...rider,
                  finishTime
                });
                const ridersData = await getRiders(db); // TODO better way this then
                setRiders(ridersData);
              }}
            >
              stop
            </button>
          </div>
        ))}
        {/* <button onClick={async() => {
      const startTime = await db.startTime.toArray();
      const results = await getResults();
      const clockStart = startTime.find(t => t.time).time // TODO this better
      results.map((rider) => {
        console.log('riderTime', convertMS(rider.time - clockStart)) // minus their start position times interval seconds (60) * 1000
      })
    }}>get results</button> */}
      </div>
    </>
  );
};

Index.getInitialProps = async function() {
  return {};
};

// const all = await db.friends.toArray()

export default Index;
// create start list page,
// results page,
// timing page
// vieweing page
// starters page - shows countdown
// input for start time
// show results as they're entered
// DNS // DNF
// set interval between riders
// DNF
// input for riders time / or show time and have edit button
// calc results
// make all fields editable, name etc.
// make startTime overridable for each rider

// cameraAPI pic of rider when know they are on the course?

// have a viewing version for people on the course (shows current riders on the course, dns, updates every second - OR push notification?)
// have a starters version
// have a finishers version
