import {Banner} from './Banner'
import {Top} from './Top'
import {AddPost} from './AddPost'
import {Posts} from './Posts'
import {Login} from './Login'

const App = () =>{

    if(sessionStorage.getItem("token") === null){
        return <div><Banner /><Login /></div>
    }
    return <div>
            <div>
                <Banner /><Top />
            </div>
            <div>
                <AddPost /><Posts />
            </div>
        </div>
}

export default App;