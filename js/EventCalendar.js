class EventCalendar {
    static addZeroForTime(value) {
        return value.toString().padStart(2, '0')
    }

    static getFormatTime(mins) {
        mins += 480
        let hours = Math.trunc(mins / 60)
        let minutes = mins % 60
        return `${EventCalendar.addZeroForTime(hours)}:${EventCalendar.addZeroForTime(minutes)}`
    }

    static parseFormatTime(time) {
        const [hrs, mins] = time.split(':')
        return (Number(hrs) - 8) * 60 + Number(mins)
    }

    static convertTimePoint(timePoint) {
        return Number(timePoint.childNodes[1].textContent)
    }

    static removeEvents() {
        const events = document.querySelectorAll('.event')
        events.forEach(el => el.remove())
    }

    static hexToRGB(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16)
        const g = parseInt(hex.slice(3, 5), 16)
        const b = parseInt(hex.slice(5, 7), 16)

        return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgba(${r}, ${g}, ${b})`
    }

    static showNotification(title, msg) {
        const notification = document.querySelector('.notification')
        const namePara = document.createElement('p')
        const msgPara = document.createElement('p')

        namePara.innerText = title
        msgPara.innerText = msg
        notification.append(namePara, msgPara)

        notification.classList.remove('hide-notification')
        notification.classList.add('show-notification')

        setTimeout(() => {
            while (notification.firstChild) {
                notification.removeChild(notification.firstChild)
            }
            notification.classList.remove('show-notification')
            notification.classList.add('hide-notification')
        }, 3000)
    }

    static setNotificationTimeout(startTime, title) {
        const date = new Date()
        startTime += 480
        let currentTime = EventCalendar.parseFormatTime(`${EventCalendar.addZeroForTime(date.getHours())}:${EventCalendar.addZeroForTime(date.getMinutes())}`)
        currentTime += 480

        if (currentTime < startTime) {
            let showingTime = ((startTime - currentTime) * 60000)
            let msg = 'Has been started'
            title = `Event - ${title}`

            setTimeout(() => {
                EventCalendar.showNotification(title, msg)
            }, showingTime)
        }
    }

    static id = 10

    static tasks = [
        {id: 1, start: 0, duration: 15, title: 'Exercise', color: '#6e9ecf'},
        {id: 2, start: 25, duration: 30, title: 'Travel to work', color: '#6e9ecf'},
        {id: 3, start: 30, duration: 30, title: 'Plan day', color: '#6e9ecf'},
        {id: 4, start: 60, duration: 15, title: 'Review yesterday\'s commits', color: '#6e9ecf'},
        {id: 5, start: 100, duration: 15, title: 'Code review', color: '#6e9ecf'},
        {id: 6, start: 180, duration: 90, title: 'Have lunch with John', color: '#6e9ecf'},
        {id: 7, start: 360, duration: 30, title: 'Skype call', color: '#6e9ecf'},
        {id: 8, start: 370, duration: 45, title: 'Follow up with designer', color: '#6e9ecf'},
        {id: 9, start: 405, duration: 30, title: 'Push up branch', color: '#6e9ecf'},
    ]

    getTodayDate() {
        const date = new Date()

        const daysOfWeek = {0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat'}

        const months = {
            0: 'Jan',
            1: 'Feb',
            2: 'Mar',
            3: 'Apr',
            4: 'May',
            5: 'Jun',
            6: 'Jul',
            7: 'Aug',
            8: 'Sep',
            9: 'Oct',
            10: 'Nov',
            11: 'Dec'
        }

        return `${daysOfWeek[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`
    }

    createTimeTable() {
        const main = document.querySelector('#main')
        const table = document.createElement('table')
        table.id = 'timeTable'

        for (let i = 0; i <= 540; i++) {
            const tr = document.createElement('tr')
            const td = document.createElement('td')
            const span = document.createElement('span')

            td.append(EventCalendar.getFormatTime(i))
            td.setAttribute('width', '200')
            span.append(i.toString())
            span.classList.add('d-none')

            if (i % 30) td.classList.add('d-none')
            if (!(i % 60)) td.classList.add('bigTime')
            if (!(i % 30) && (i % 60)) td.classList.add('smallTime')

            tr.append(td)
            tr.append(span)
            table.append(tr)
        }

        main.append(table)
    }

    addEvent() {
        let titleInput = document.querySelector('#titleInput')
        let startInput = document.querySelector('#startInput')
        let durationInput = document.querySelector('#durationInput')
        let colorInput = document.querySelector('#colorInput')

        if (titleInput.value && startInput.value) {
            EventCalendar.tasks.push({
                id: EventCalendar.id++,
                title: titleInput.value,
                start: EventCalendar.parseFormatTime(startInput.value),
                duration: Number(durationInput.value),
                color: colorInput.value
            })

            titleInput.value = ''
            startInput.value = ''
            durationInput.value = ''
            colorInput.value = '#6e9ecf'
            this.renderEvents()
        }

    }

    deleteEvent(id) {
        EventCalendar.tasks = EventCalendar.tasks.filter(el => el.id !== Number(id))
        this.renderEvents()
    }

    updateEvent(target) {
        const div = document.createElement('div')
        const titleInput = document.createElement('input')
        const timeInput = document.createElement('input')
        const durationInput = document.createElement('input')
        const colorInput = document.createElement('input')
        const button = document.createElement('button')

        const eventId = Number(target.childNodes[1].id)
        const event = EventCalendar.tasks.find(el => el.id === eventId)

        titleInput.setAttribute('style', 'display: block; margin: 8px 0')
        titleInput.type = 'text'
        titleInput.classList.add('form__input')
        titleInput.placeholder = 'New title...'
        titleInput.value = event.title

        timeInput.setAttribute('style', 'display: block; margin-bottom: 8px')
        timeInput.type = 'time'
        timeInput.classList.add('form__input')
        timeInput.value = EventCalendar.getFormatTime(event.start)

        durationInput.setAttribute('style', 'display: block; margin-bottom: 8px')
        durationInput.type = 'number'
        durationInput.classList.add('form__input')
        durationInput.placeholder = 'Duration'
        durationInput.value = event.duration

        colorInput.setAttribute('style', 'display: block')
        colorInput.type = 'color'
        colorInput.value = event.color

        button.innerText = 'Save'
        button.classList.add('button')
        button.setAttribute('style', 'width: 100%; margin-top: 8px')

        div.append(titleInput, timeInput, durationInput, colorInput, button)
        target.append(div)

        button.addEventListener('click', (e) => {
            EventCalendar.tasks.map(el => {
                if (el.id === eventId) {
                    if (titleInput.value && timeInput.value) {
                        el.title = titleInput.value
                        el.start = EventCalendar.parseFormatTime(timeInput.value)
                        el.duration = Number(durationInput.value)
                        el.color = colorInput.value

                        div.remove()
                        this.renderEvents()
                    }
                }
            })
        })
    }

    renderEvents() {
        const timePoints = Array.from(document.querySelector('#timeTable').childNodes)

        EventCalendar.removeEvents()

        if (EventCalendar.tasks.length) {
            EventCalendar.tasks.map(el => {
                const timePointIndex = timePoints.findIndex(item => EventCalendar.convertTimePoint(item) === el.start)

                if (timePointIndex === el.start) {

                    if (timePointIndex % 30) {
                        const eventTime = timePoints[timePointIndex].childNodes[0]
                        eventTime.classList.remove('d-none')
                        eventTime.classList.add('v-hidden')
                    }

                    const td = document.createElement('td')
                    const span = document.createElement('span')
                    td.innerText = el.title
                    td.classList.add('event')
                    td.setAttribute('style',
                        `background-color: ${EventCalendar.hexToRGB(el.color, 0.5)}; border-left: 3px solid ${el.color}`)
                    span.classList.add('delete-marker')
                    span.id = el.id

                    if (!el.duration) el.duration = 1

                    td.setAttribute('rowspan', el.duration)
                    td.append(span)
                    timePoints[timePointIndex].append(td)

                    EventCalendar.setNotificationTimeout(el.start, el.title)
                } else {
                    console.log('Время ограничено с 08 до 17')
                }
            })
        }
    }
}