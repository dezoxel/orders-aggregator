Doctor = require '../lib/doctor'

describe 'Doctor', ->
  doctor = fakeDb = null

  beforeEach ->
    fakeDb = factory.buildSync 'db'
    doctor = new Doctor fakeDb

  describe 'when diagnosing db connection', ->

    it 'doesnt generate report if db connection established', ->
      doctor.diagnose_db_connection().finally ->
        expect(doctor.has_report_for 'dbConnection').to.be.false

    it 'generates report if any connection error', ->
      doctor = new Doctor factory.buildSync 'db', state: 'disconnected'

      doctor.diagnose_db_connection().finally ->
        expect(doctor.has_report_for 'dbConnection').to.be.true

    it 'closes db connection if no error occurred', ->
      doctor.diagnose_db_connection().finally ->
        expect(doctor.getDB().isConnected()).to.be.false
