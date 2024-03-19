import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import UserNavbar from '../partials/navbar';


const History = () => {
  return (
    <>
    <UserNavbar />
    
    <div className='d-flex flex-column container'>
    
 
    <h1 className='anton-regular uppercase mb-4'>MY WORKOUTS</h1>

    

    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Workout</th>
          <th>Duration</th>
          <th>Calories</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
        </tr>
       
      </tbody>
    </Table>
  
  </div>
  </>
  )
}

export default History
