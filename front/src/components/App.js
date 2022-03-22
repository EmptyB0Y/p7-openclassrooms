import {Banner} from './Banner'
import {Top} from './Top'
import {Posts} from './Posts'
import {Login} from './Login'

const App = () =>{

    if(sessionStorage.getItem("token") === null){
        return <div><Banner /><Login /></div>
    }
    return <div><Banner /><Top /><div><Posts /></div></div>
}

export default App;