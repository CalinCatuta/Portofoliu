const btn = document.querySelector('#comment')

btn.addEventListener('click', function(){
    fetch('comment.json')
    .then((res) => res.json())
    .then((data) => {
        let output = ` <div class="col-md-6">  <figure>
        <blockquote class="blockquote">
          <p>Easy to find friends.</p>
        </blockquote>
        <figcaption class="blockquote-footer">
          From <cite title="Source Title">John Doe</cite>
        </figcaption>
      </figure>  </div>`;

        data.forEach(function(user){
            output += `
            <div class="col-md-6">
            <figure>
            <blockquote class="blockquote">
              <p>${user.coment}.</p>
            </blockquote>
            <figcaption class="blockquote-footer">
              From <cite title="Source Title">${user.name}</cite>
            </figcaption>
          </figure>
          </div>
            `
        })
        document.getElementById('output').innerHTML = output;
    })
})

