import React from 'react';
import './App.css';

const PRACOWNICY = [
  { "imie": "Jan", "nazwisko": "Kowalski", "dzial": "IT", "wynagrodzenieKwota": "3000", "wynagrodzenieWaluta": "PLN" },
  { "imie": "Anna", "nazwisko": "Bąk", "dzial": "Administracja", "wynagrodzenieKwota": "2400.50", "wynagrodzenieWaluta": "PLN" },
  { "imie": "Paweł", "nazwisko": "Zabłocki", "dzial": "IT", "wynagrodzenieKwota": "3300", "wynagrodzenieWaluta": "PLN" },
  { "imie": "Tomasz", "nazwisko": "Osiecki", "dzial": "Administracja", "wynagrodzenieKwota": "2100", "wynagrodzenieWaluta": "PLN" },
  { "imie": "Iwona", "nazwisko": "Leihs-Gutowska", "dzial": "Handlowiec", "wynagrodzenieKwota": "3100", "wynagrodzenieWaluta": "PLN" },
]

const filtersName = [];
filtersName.length = PRACOWNICY.length;
filtersName.fill(1);

const filtersDept = [];
filtersDept.length = PRACOWNICY.length;
filtersDept.fill(1);

const filtersSalary = [];
filtersSalary.length = PRACOWNICY.length;
filtersSalary.fill(1);


const filtersFinal = [];
filtersFinal.length = PRACOWNICY.length;
filtersFinal.fill(1);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: [],
      salarySelected: '',
      departmentsSelected: [],
      bySalary: [],
      byName: [],
      byDept: [],
      newEmployee: {
        imie: '', nazwisko: '', dzial: '', wynagrodzenieKwota: '', wynagrodzenieWaluta: ''
      }
    }
    this.renderDepartments = this.renderDepartments.bind(this);
    this.showByDept = this.showByDept.bind(this);
    this.showByNameSurname = this.showByNameSurname.bind(this);
    this.showByPaymentRange = this.showByPaymentRange.bind(this);
    this.setName = this.setName.bind(this);
    this.setSurname = this.setSurname.bind(this);
    this.setDept = this.setDept.bind(this);
    this.setSalary = this.setSalary.bind(this);
    this.setCurrency = this.setCurrency.bind(this);
    this.createEmployee = this.createEmployee.bind(this);
  }

  componentDidMount() {
    const depts = this.groupByDept();
    const deptsArr = [];
    for (const [key, value] of Object.entries(depts)) {
      deptsArr.push(key);
    }
    this.setState({ departmentsSelected: deptsArr });
    this.checkAll();
  }

  checkAll() {
    for (let i = 0; i < PRACOWNICY.length; i++) {
      if (filtersName[i] === 1 && filtersDept[i] === 1 && filtersSalary[i] === 1) {
        filtersFinal[i] = 1;
      }
      else {
        filtersFinal[i] = 0;
      }
    }
    this.setState({ filters: filtersFinal });
  }

  setName(e) {
    this.setState(prevState => {
      let newEmployee = Object.assign({}, prevState.newEmployee);
      newEmployee.imie = e.target.value;
      return { newEmployee };
    });
  }
  setSurname(e) {
    this.setState(prevState => {
      let newEmployee = Object.assign({}, prevState.newEmployee);
      newEmployee.nazwisko = e.target.value;
      return { newEmployee };
    });
  }

  setDept(e) {
    this.setState(prevState => {
      let newEmployee = Object.assign({}, prevState.newEmployee);
      newEmployee.dzial = e.target.value;
      return { newEmployee };
    });
  }

  setSalary(e) {
    this.setState(prevState => {
      let newEmployee = Object.assign({}, prevState.newEmployee);
      newEmployee.wynagrodzenieKwota = e.target.value;
      return { newEmployee };
    });
  }

  setCurrency(e) {
    this.setState(prevState => {
      let newEmployee = Object.assign({}, prevState.newEmployee);
      newEmployee.wynagrodzenieWaluta = e.target.value;
      return { newEmployee };
    });
  }

  createEmployee(e) {
    e.preventDefault();
    PRACOWNICY.push(this.state.newEmployee);
    this.setState({ newEmployee: '' });
  }

  showByNameSurname(e) {
    //  if (e.target.value.length > 1) {
    for (const [key, emp] of Object.entries(PRACOWNICY)) {
      (emp.imie.toLowerCase().includes(String(e.target.value).toLowerCase()) || emp.nazwisko.toLowerCase().includes(String(e.target.value).toLowerCase())) ? filtersName[key] = 1 : filtersName[key] = 0;
    }
    this.checkAll();
    //} 
  }

  showByPaymentRange(e) {
    for (const [key, emp] of Object.entries(PRACOWNICY)) {
      emp.wynagrodzenieKwota <= e.target.value ? filtersSalary[key] = 1 : filtersSalary[key] = 0;
    }
    this.checkAll();
    this.setState({ salarySelected: e.target.value });

  }

  groupByDept() {//dodac indeks do pracownika
    const arr = [];
    for (const [key, emp] of Object.entries(PRACOWNICY)) {
      if (arr[emp.dzial] === undefined) arr[emp.dzial] = [];
      emp.index = key;
      arr[emp.dzial].push(emp);
    }
    return arr;
  }

  salaryByDept() {
    const arr = this.groupByDept();
    const salariesOfDept = [];
    for (const key in arr) {
      const sum = arr[key].reduce((a, b) => ({ wynagrodzenieKwota: Number(a.wynagrodzenieKwota) + Number(b.wynagrodzenieKwota) }), { wynagrodzenieKwota: 0 });
      salariesOfDept[key] = sum;
    }
    return salariesOfDept;
  }


  renderSalaryByDept() {
    const arr = this.salaryByDept();
    return Object.keys(arr).map((elem, index) => {
      return <tr key={index}><td>{elem}</td><td>{arr[elem].wynagrodzenieKwota}</td></tr>
    });
  }


  renderDepartments() {
    const arr = this.groupByDept();
    console.log(arr);
    return Object.keys(arr).map((elem, index) => {
      return <div key={index}>
        <input value={index} onChange={this.showByDept} type="checkbox" defaultChecked name={elem} />
        <label>{elem}</label>
      </div>
    });
  }

  showByDept(e) {
    let deptSelState = this.state.departmentsSelected;
    if (e.target.checked) {
      deptSelState.push(e.target.name);
      for (const [key, emp] of Object.entries(PRACOWNICY)) {
        for (const dept of deptSelState) {
          if (emp.dzial === dept) {
            filtersDept[key] = 1;
            break;
          } else {
            filtersDept[key] = 0;
          }
        }
      }
      this.checkAll();
      this.setState({ departmentsSelected: deptSelState });
      console.log(deptSelState);
    } else {
      for (const [key, emp] of Object.entries(PRACOWNICY)) {
        if (emp.dzial === e.target.name) filtersDept[key] = 0;
      }
      const filteredItems = deptSelState.filter(item => item !== e.target.name);
      this.setState({ departmentsSelected: filteredItems });
      this.checkAll();
    }
  }



  render() {
    const employees = PRACOWNICY.map((emp, index) => {
      return <tr className={this.state.filters[index] === 1 ? 'selected' : ''} key={index}><td>{emp.imie}</td><td>{emp.nazwisko}</td><td>{emp.dzial}</td><td>{emp.wynagrodzenieKwota} {emp.wynagrodzenieWaluta}</td></tr>
    });
    const salaryAllSum = PRACOWNICY.reduce((a, b) => ({ wynagrodzenieKwota: Number(a.wynagrodzenieKwota) + Number(b.wynagrodzenieKwota) }));
    const departments = this.renderDepartments();
    const salaryByDept = this.renderSalaryByDept();
    return (
      <div className="App" >
        <div className="left-column">
          <fieldset id="filters">
            <legend>Filtry</legend>
            <input placeholder="Wyszukaj - nazwa" onChange={this.showByNameSurname} type="text" id="name-search" name="name" />
            <div>
              <label for="name">Wynagrodzenie: (1000, {this.state.salarySelected})</label>
              <input onChange={this.showByPaymentRange} type="range" id="salary" name="salary" min="1000" max="10000" step="100" />
            </div>
            <div name="departments" id="departments">
              <label>Dział:</label>
              {departments}
            </div>
          </fieldset>
          <div id="create-employee">
            <form onSubmit={this.createEmployee}>
              <input placeholder="Imię" onChange={this.setName} type="text" name="name-create" required />
              <input placeholder="Nazwisko" onChange={this.setSurname} type="text" name="surnname-create" required />
              <input placeholder="Dział" onChange={this.setDept} type="text" name="dept-create" required />
              <input placeholder="Wynagrodzenie" onChange={this.setSalary} type="text" name="salary-create" required />
              <input placeholder="Waluta wynagrodzenia" onChange={this.setCurrency} type="text" name="currency-create" required />
              <button type="submit">Utwórz</button>
            </form>
          </div>
        </div>
        <div id="main">
          <table>
            <thead><tr><td>Imię</td><td>Nazwisko</td><td>Dział</td><td>Kwota</td></tr></thead>
            <tbody>
              {employees}
            </tbody>
          </table>
          <table>
            <thead><tr><td>Dział</td><td>Kwota</td></tr></thead>
            <tbody>
              {salaryByDept}
              <tr><td>Suma</td><td>{salaryAllSum.wynagrodzenieKwota}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
