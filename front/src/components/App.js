import Banner from './Banner'
import Top from './Top'
import {Posts} from './Posts'

function App() {
    sessionStorage.setItem("token","eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjI0MjQzMjc5NmQ3NDcwMDRmYTNlYjYiLCJpYXQiOjE2NDc0NTAwNTMsImV4cCI6MTY0NzUzNjQ1M30.tsTZw8USlngKPgK03HblgcvjltX9fCkDFyoXCQLCY14");
    return <div><Banner /><Top /><div><Posts /></div></div>
}

export default App;
