import '../styles/App.css'
import {Banner} from './Banner'
import {Top} from './Top'
import {AddPost} from './AddPost'
import {Posts} from './Posts'
import {Login} from './Login'

const App = () =>{

    if(sessionStorage.getItem("token") === null){
        return <div><Banner /><Login /></div>
    }
    return <div className='relative'>
            <div className='sticky'>
                <Banner /><Top />
            </div>
            <div>
                <AddPost topic='notopic'/><Posts topic="notopic"/>
            </div>
        </div>
}

export default App;