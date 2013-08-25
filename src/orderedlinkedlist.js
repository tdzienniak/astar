(function (global) {
    function OrderedLinkedList () {
        this.head = this.tail = null;
    }

    OrderedLinkedList.prototype = {

        /**
         * Adds new node at the end of the list.
         * Function is only a syntax sugar.
         * @param  {any} data any valid JavaScript data
         * @return {OrderedLinkedList} this
         */
        append: function (data) {
            return this.insert(data);
        },

        /**
         * Removes given node from list.
         * @param  {Node} node
         * @return {undefined}
         */
        remove: function (node) {
            if (node == this.head) {
                this.head = this.head.next;
            }

            if (node == this.tail) {
                this.tail = this.tail.previous;
            }

            if (node.previous) {
                node.previous.next = node.next;
            }

            if (node.next) {
                node.next.previous = node.previous;
            }
        },
        insert: function (data, priority) {
            var node = {
                next: null,
                previous: null,
                priority: null,
                data: data
            };

            /*
             * list is empty
             */
            if (this.head === null) {
                node.priority = priority || 0;
                this.head = this.tail = node;

                return this;
            }

            var current = this.head;

            node.priority = priority || this.tail.priority;

            /*
             * list contains only one node (head = tail)
             */
            if (current.next === null) {
                if (current.priority <= node.priority) {
                    current.next = node;
                    this.tail = current.next;
                    this.tail.previous = current;
                } else {
                    this.head = node;
                    this.head.next = this.tail = current;
                    this.tail.previous = this.head;
                }

                return this;
            }

            /*
             * node priority is greater or equal tail priority
             * node should become tail
             */
            if (node.priority >= this.tail.priority) {
                this.tail.next = node;
                node.previous = this.tail;
                this.tail = node;

                return this;
            }

            /*
             * node priority is less than head priority
             * node should become head
             */
            if (node.priority < this.head.priority) {
                this.head.previous = node;
                node.next = this.head;
                this.head = node;

                return this;
            }

            /*
             * list has more than one node
             */
            while (current.next !== null) {
               if (current.next.priority > node.priority) {
                    node.next = current.next;
                    node.previous = current;
                    current.next.previous = node;
                    current.next = node;

                    break;
                }

                current = current.next;
            }

            return this;
        }
    };

    global["OrderedLinkedList"] = OrderedLinkedList;
})(this);