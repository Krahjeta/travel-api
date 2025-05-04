function BookTicket() {
    return (
      <div>
        <h2>Rezervo Biletë</h2>
        <form>
          <div>
            <label>Destinacioni:</label>
            <input type="text" name="destination" />
          </div>
          <div>
            <label>Data Nisjes:</label>
            <input type="date" name="date" />
          </div>
          <div>
            <label>Çmimi:</label>
            <input type="number" name="price" />
          </div>
          <button type="submit">Rezervo</button>
        </form>
      </div>
    );
  }
  
  export default BookTicket;
  